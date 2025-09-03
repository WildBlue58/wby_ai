#include <bits/stdc++.h>
using namespace std;

static const long long MOD = 1000000007LL;

struct Comb {
	vector<long long> fact, ifact;
	int maxN;

	long long mod_pow(long long a, long long e) {
		long long r = 1 % MOD;
		a %= MOD;
		while (e > 0) {
			if (e & 1) r = (r * a) % MOD;
			a = (a * a) % MOD;
			e >>= 1;
		}
		return r;
	}

	void init(int n) {
		maxN = n;
		fact.assign(maxN + 1, 1);
		ifact.assign(maxN + 1, 1);
		for (int i = 1; i <= maxN; ++i) fact[i] = fact[i - 1] * i % MOD;
		ifact[maxN] = mod_pow(fact[maxN], MOD - 2);
		for (int i = maxN; i >= 1; --i) ifact[i - 1] = ifact[i] * i % MOD;
	}

	inline long long C(long long n, long long k) const {
		if (n < 0 || k < 0 || k > n) return 0;
		if (n > maxN) return 0; // safety
		return (((fact[(int)n] * ifact[(int)k]) % MOD) * ifact[(int)(n - k)]) % MOD;
	}
} comb;

static inline long long norm(long long x) {
	x %= MOD;
	if (x < 0) x += MOD;
	return x;
}

// Prefix sums for number of solutions of length k with each in [0..M]
// count_prefix(u): sum_{t=0..u} c_k^M(t)
// sum_prefix(u): sum_{t=0..u} t * c_k^M(t)

static long long count_prefix(long long u, int k, int M) {
	if (u < 0) return 0;
	if (k == 0) {
		// Only t = 0 contributes
		return 1; // for any u >= 0
	}
	long long res = 0;
	long long step = (long long)M + 1;
	long long J = u / step;
	for (long long j = 0; j <= J; ++j) {
		long long sign = (j & 1) ? (MOD - 1) : 1;
		long long R = u - j * step; // >= 0
		long long term = comb.C(k, j) * comb.C(R + k, k) % MOD;
		res += sign * term % MOD;
		if (res >= MOD) res -= MOD;
	}
	return res;
}

static long long sum_prefix(long long u, int k, int M) {
	if (u < 0) return 0;
	if (k == 0) {
		return 0;
	}
	long long res = 0;
	long long step = (long long)M + 1;
	long long J = u / step;
	for (long long j = 0; j <= J; ++j) {
		long long sign = (j & 1) ? (MOD - 1) : 1;
		long long R = u - j * step; // >= 0
		// k * C(R + k, k + 1) + j*(M+1) * C(R + k, k)
		long long t1 = ( (long long)k * comb.C(R + k, k + 1) ) % MOD;
		long long t2 = ( ( (j % MOD) * (step % MOD) ) % MOD ) * comb.C(R + k, k) % MOD;
		long long inner = (t1 + t2) % MOD;
		long long term = comb.C(k, j) * inner % MOD;
		res += sign * term % MOD;
		if (res >= MOD) res -= MOD;
	}
	return res;
}

static long long compute_answer_single(int n, int m) {
	if (m == 0) return 0; // only all-zero array -> f=0
	long long ans = 0;
	int k1 = n - 2; // may be 0
	int k2 = n - 3; // may be -1

	for (int M = 0; M <= m; ++M) {
		// A(M) part: coef of R * P^{n-2} at degree s = m - M
		long long T = (long long)m - 2LL * M; // can be negative
		long long E1 = sum_prefix(T + M, k1, M);
		long long E0 = sum_prefix(T, k1, M);
		long long C1 = count_prefix(T + M, k1, M);
		long long C0 = count_prefix(T, k1, M);
		long long A = ( (E1 - E0) % MOD - norm(T) * ((C1 - C0) % MOD) ) % MOD;
		A = norm(A);

		// B(M) part: (n-2) * coef of x^M * R * P^{n-3}
		long long B = 0;
		if (n >= 3) {
			long long T2 = (long long)m - 3LL * M;
			long long E1b = sum_prefix(T2 + M, k2, M);
			long long E0b = sum_prefix(T2, k2, M);
			long long C1b = count_prefix(T2 + M, k2, M);
			long long C0b = count_prefix(T2, k2, M);
			long long inner = ( (E1b - E0b) % MOD - norm(T2) * ((C1b - C0b) % MOD) ) % MOD;
			inner = norm(inner);
			B = ( (long long)(n - 2) * inner ) % MOD;
		}

		ans += A;
		if (ans >= MOD) ans -= MOD;
		ans += B;
		if (ans >= MOD) ans -= MOD;
	}
	return ans % MOD;
}

int main() {
	ios::sync_with_stdio(false);
	cin.tie(nullptr);

	int Tt; if (!(cin >> Tt)) return 0;
	vector<pair<int,int>> qs;
	qs.reserve(Tt);
	int max_n = 0, max_m = 0;
	for (int i = 0; i < Tt; ++i) {
		int n, m; cin >> n >> m;
		qs.emplace_back(n, m);
		max_n = max(max_n, n);
		max_m = max(max_m, m);
	}
	int LIM = max_n + max_m + 5;
	comb.init(LIM);

	for (auto [n, m] : qs) {
		cout << compute_answer_single(n, m) << '\n';
	}
	return 0;
}


