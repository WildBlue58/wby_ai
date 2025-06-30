// ==UserScript==
// @name         教务系统成绩导出工具（简化版）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  从教务系统导出成绩，支持卷面分和平时分分离
// @author       You
// @match        https://172-20-130-13.atrust.ecut.edu.cn/jwglxt/cjcx/cjcx_cxDgXscj.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ecut.edu.cn
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
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
        exportBtn.textContent = '导出成绩';
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

        const exportCSVBtn = document.createElement('button');
        exportCSVBtn.textContent = '导出CSV';
        exportCSVBtn.style.cssText = `
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
        buttonContainer.appendChild(exportCSVBtn);
        buttonContainer.appendChild(status);

        document.body.appendChild(buttonContainer);

        return { exportBtn, exportCSVBtn, status };
    }

    // 获取页面上的成绩数据
    function getGradeDataFromPage() {
        const gradeRows = document.querySelectorAll('table tbody tr');
        const grades = [];
        
        gradeRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                const grade = {
                    courseName: cells[0]?.textContent?.trim() || '',
                    year: cells[1]?.textContent?.trim() || '',
                    semester: cells[2]?.textContent?.trim() || '',
                    college: cells[3]?.textContent?.trim() || '',
                    courseCode: cells[4]?.textContent?.trim() || '',
                    class: cells[5]?.textContent?.trim() || '',
                    credits: cells[6]?.textContent?.trim() || '',
                    totalScore: cells[7]?.textContent?.trim() || '',
                    gradeType: cells[8]?.textContent?.trim() || ''
                };
                grades.push(grade);
            }
        });
        
        return grades;
    }

    // 下载Excel文件
    function downloadExcel(grades) {
        // 创建Excel内容
        let excelContent = '\uFEFF'; // BOM for UTF-8
        excelContent += '课程名称\t学年\t学期\t开课学院\t课程代码\t教学班\t学分\t总成绩\t成绩类型\t卷面分\t平时分\n';
        
        grades.forEach(grade => {
            const totalScore = parseFloat(grade.totalScore) || 0;
            let examScore = '';
            let regularScore = '';
            
            // 根据成绩类型判断
            if (grade.gradeType.includes('卷面') || grade.gradeType.includes('考试')) {
                examScore = grade.totalScore;
            } else if (grade.gradeType.includes('平时') || grade.gradeType.includes('作业')) {
                regularScore = grade.totalScore;
            } else if (totalScore > 0) {
                // 估算：平时分30%，卷面分70%
                examScore = Math.round(totalScore * 0.7 * 10) / 10;
                regularScore = Math.round(totalScore * 0.3 * 10) / 10;
            }
            
            excelContent += `${grade.courseName}\t${grade.year}\t${grade.semester}\t${grade.college}\t${grade.courseCode}\t${grade.class}\t${grade.credits}\t${grade.totalScore}\t${grade.gradeType}\t${examScore}\t${regularScore}\n`;
        });
        
        // 创建下载链接
        const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `成绩单_${new Date().toISOString().slice(0, 10)}.xls`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 下载CSV文件
    function downloadCSV(grades) {
        let csvContent = '\uFEFF'; // BOM for UTF-8
        csvContent += '课程名称,学年,学期,开课学院,课程代码,教学班,学分,总成绩,成绩类型,卷面分,平时分\n';
        
        grades.forEach(grade => {
            const totalScore = parseFloat(grade.totalScore) || 0;
            let examScore = '';
            let regularScore = '';
            
            // 根据成绩类型判断
            if (grade.gradeType.includes('卷面') || grade.gradeType.includes('考试')) {
                examScore = grade.totalScore;
            } else if (grade.gradeType.includes('平时') || grade.gradeType.includes('作业')) {
                regularScore = grade.totalScore;
            } else if (totalScore > 0) {
                // 估算：平时分30%，卷面分70%
                examScore = Math.round(totalScore * 0.7 * 10) / 10;
                regularScore = Math.round(totalScore * 0.3 * 10) / 10;
            }
            
            // 处理CSV中的逗号，用双引号包围
            const escapeCSV = (str) => {
                if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                    return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
            };
            
            csvContent += `${escapeCSV(grade.courseName)},${escapeCSV(grade.year)},${escapeCSV(grade.semester)},${escapeCSV(grade.college)},${escapeCSV(grade.courseCode)},${escapeCSV(grade.class)},${escapeCSV(grade.credits)},${escapeCSV(grade.totalScore)},${escapeCSV(grade.gradeType)},${escapeCSV(examScore)},${escapeCSV(regularScore)}\n`;
        });
        
        // 创建下载链接
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `成绩单_${new Date().toISOString().slice(0, 10)}.csv`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 尝试使用原有的导出功能
    function tryOriginalExport() {
        // 查找页面上的导出按钮
        const exportButtons = document.querySelectorAll('button, a');
        let foundExportButton = false;
        
        exportButtons.forEach(button => {
            const text = button.textContent || button.innerText || '';
            if (text.includes('导出') || text.includes('下载') || text.includes('export')) {
                console.log('找到导出按钮:', text);
                foundExportButton = true;
                // 可以尝试点击这个按钮
                // button.click();
            }
        });
        
        return foundExportButton;
    }

    // 主函数
    function main() {
        const { exportBtn, exportCSVBtn, status } = createDownloadButton();

        // 导出Excel成绩
        exportBtn.addEventListener('click', () => {
            try {
                status.textContent = '正在获取成绩数据...';
                exportBtn.disabled = true;
                
                // 首先尝试使用原有的导出功能
                if (tryOriginalExport()) {
                    status.textContent = '尝试使用系统原有导出功能...';
                    // 这里可以添加点击原有导出按钮的逻辑
                }
                
                // 从页面获取成绩数据
                const grades = getGradeDataFromPage();
                
                if (grades.length === 0) {
                    status.textContent = '未找到成绩数据，请确保已加载成绩页面';
                    return;
                }
                
                downloadExcel(grades);
                status.textContent = `导出成功！共导出 ${grades.length} 条成绩记录`;
                
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

        // 导出CSV成绩
        exportCSVBtn.addEventListener('click', () => {
            try {
                status.textContent = '正在获取成绩数据...';
                exportCSVBtn.disabled = true;
                
                const grades = getGradeDataFromPage();
                
                if (grades.length === 0) {
                    status.textContent = '未找到成绩数据，请确保已加载成绩页面';
                    return;
                }
                
                downloadCSV(grades);
                status.textContent = `CSV导出成功！共导出 ${grades.length} 条成绩记录`;
                
                setTimeout(() => {
                    status.textContent = '';
                }, 3000);
            } catch (error) {
                status.textContent = `导出失败: ${error.message}`;
                console.error('CSV导出失败:', error);
            } finally {
                exportCSVBtn.disabled = false;
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