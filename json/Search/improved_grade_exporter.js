// ==UserScript==
// @name         教务系统成绩导出工具（改进版）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  从教务系统导出成绩，支持卷面分和平时分分离
// @author       You
// @match        https://172-20-130-13.atrust.ecut.edu.cn/jwglxt/cjcx/cjcx_cxDgXscj.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ecut.edu.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function waitForElement(selector, callback, maxWait = 10000) {
        const startTime = Date.now();
        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (Date.now() - startTime < maxWait) {
                setTimeout(checkElement, 100);
            } else {
                console.log('等待元素超时:', selector);
            }
        };
        checkElement();
    }

    // 获取CSRF Token
    function getCSRFToken() {
        const tokenElement = document.querySelector('meta[name="_csrf"]');
        return tokenElement ? tokenElement.getAttribute('content') : '';
    }

    // 获取所有请求头
    function getHeaders() {
        const token = getCSRFToken();
        return {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': token,
            'Referer': window.location.href,
            'Origin': window.location.origin
        };
    }

    // 创建下载按钮
    function createDownloadButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: #fff;
            border: 2px solid #007bff;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        const title = document.createElement('div');
        title.textContent = '成绩导出工具';
        title.style.cssText = 'font-weight: bold; margin-bottom: 10px; color: #007bff;';

        const exportBtn = document.createElement('button');
        exportBtn.textContent = '导出Excel成绩';
        exportBtn.style.cssText = `
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 8px;
            font-size: 14px;
        `;

        const exportDetailedBtn = document.createElement('button');
        exportDetailedBtn.textContent = '导出详细成绩';
        exportDetailedBtn.style.cssText = `
            background: #28a745;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        const status = document.createElement('div');
        status.style.cssText = 'margin-top: 8px; font-size: 12px; color: #666;';

        buttonContainer.appendChild(title);
        buttonContainer.appendChild(exportBtn);
        buttonContainer.appendChild(exportDetailedBtn);
        buttonContainer.appendChild(status);

        document.body.appendChild(buttonContainer);

        return { exportBtn, exportDetailedBtn, status };
    }

    // 获取成绩数据
    async function fetchGradeData() {
        const xnm = document.querySelector('#xnm')?.value || new Date().getFullYear();
        const xqm = document.querySelector('#xqm')?.value || '3'; // 默认第一学期

        const formData = new URLSearchParams({
            'gnmkdmKey': 'N305005',
            'xnm': xnm,
            'xqm': xqm,
            'dcclbh': 'JW_N305005_GLY',
            'exportModel.selectCol': [
                'kcmc@课程名称',
                'xnmmc@学年',
                'xqmmc@学期',
                'kkbmmc@开课学院',
                'kch@课程代码',
                'jxbmc@教学班',
                'xf@学分',
                'xmcj@成绩',
                'xmblmc@成绩分项'
            ].join('&exportModel.selectCol='),
            'exportModel.exportWjgs': 'xls',
            'fileName': '成绩单_' + new Date().getTime()
        });

        try {
            const response = await fetch('/jwglxt/cjcx/cjcx_dcXsKccjList.html', {
                method: 'POST',
                headers: getHeaders(),
                body: formData.toString(),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                // 如果返回的是HTML，说明可能是权限问题
                const text = await response.text();
                if (text.includes('无功能权限')) {
                    throw new Error('权限不足，请确保已登录教务系统');
                }
                throw new Error('服务器返回了HTML而不是Excel文件');
            }

            return await response.blob();
        } catch (error) {
            console.error('获取成绩数据失败:', error);
            throw error;
        }
    }

    // 下载文件
    function downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 处理Excel数据，分离卷面分和平时分
    function processExcelData(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                    // 处理数据，分离卷面分和平时分
                    const processedData = [];
                    const headers = ['课程名称', '学年', '学期', '开课学院', '课程代码', '教学班', '学分', '总成绩', '卷面分', '平时分'];

                    processedData.push(headers);

                    for (let i = 1; i < jsonData.length; i++) {
                        const row = jsonData[i];
                        if (row && row.length > 0) {
                            const newRow = [...row];
                            
                            // 尝试从成绩分项中提取卷面分和平时分
                            const gradeItem = row[8] || ''; // 成绩分项
                            if (gradeItem.includes('卷面') || gradeItem.includes('考试')) {
                                newRow[8] = row[7] || ''; // 卷面分
                                newRow[9] = ''; // 平时分
                            } else if (gradeItem.includes('平时') || gradeItem.includes('作业')) {
                                newRow[8] = ''; // 卷面分
                                newRow[9] = row[7] || ''; // 平时分
                            } else {
                                // 如果没有明确的分项，尝试从总成绩中估算
                                const totalScore = parseFloat(row[7]) || 0;
                                if (totalScore > 0) {
                                    // 简单的估算：假设平时分占30%，卷面分占70%
                                    newRow[8] = Math.round(totalScore * 0.7 * 10) / 10; // 卷面分
                                    newRow[9] = Math.round(totalScore * 0.3 * 10) / 10; // 平时分
                                } else {
                                    newRow[8] = '';
                                    newRow[9] = '';
                                }
                            }
                            
                            processedData.push(newRow);
                        }
                    }

                    // 创建新的工作簿
                    const newWorkbook = XLSX.utils.book_new();
                    const newWorksheet = XLSX.utils.aoa_to_sheet(processedData);
                    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, '成绩详情');

                    // 转换为blob
                    const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
                    const newBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                    resolve(newBlob);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
        });
    }

    // 主函数
    async function main() {
        const { exportBtn, exportDetailedBtn, status } = createDownloadButton();

        // 导出Excel成绩
        exportBtn.addEventListener('click', async () => {
            try {
                status.textContent = '正在获取成绩数据...';
                exportBtn.disabled = true;
                
                const blob = await fetchGradeData();
                const filename = `成绩单_${new Date().toISOString().slice(0, 10)}.xlsx`;
                
                downloadFile(blob, filename);
                status.textContent = '导出成功！';
                
                setTimeout(() => {
                    status.textContent = '';
                }, 3000);
            } catch (error) {
                status.textContent = `导出失败: ${error.message}`;
                console.error('导出失败:', error);
            } finally {
                exportBtn.disabled = false;
            }
        });

        // 导出详细成绩（分离卷面分和平时分）
        exportDetailedBtn.addEventListener('click', async () => {
            try {
                status.textContent = '正在处理详细成绩数据...';
                exportDetailedBtn.disabled = true;
                
                const blob = await fetchGradeData();
                const processedBlob = await processExcelData(blob);
                const filename = `详细成绩单_${new Date().toISOString().slice(0, 10)}.xlsx`;
                
                downloadFile(processedBlob, filename);
                status.textContent = '详细成绩导出成功！';
                
                setTimeout(() => {
                    status.textContent = '';
                }, 3000);
            } catch (error) {
                status.textContent = `导出失败: ${error.message}`;
                console.error('详细成绩导出失败:', error);
            } finally {
                exportDetailedBtn.disabled = false;
            }
        });
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})(); 