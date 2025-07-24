<template>
  <div class="page-container">
    <div class="main-wrapper">
      <!-- 페이지 헤더 -->
      <div class="header-section">
        <h1 class="title">🚀 Rebo O&M 프로젝트</h1>
        <p class="subtitle">페이지 바로가기</p>
      </div>

      <!-- 페이지 그룹을 표시할 그리드 컨테이너 -->
      <div class="grid-container">
        <!-- v-for를 사용하여 데이터 기반으로 카드 생성 -->
        <div v-for="group in pageGroups" :key="group.title" class="card">
          <div class="card-header">
            <h2 class="card-title">{{ group.title }}</h2>
          </div>
          <div class="card-body">
            <ul class="link-list">
              <li v-for="link in group.links" :key="link.to">
                <NuxtLink :to="link.to" class="link-item">
                  <div class="link-info">
                    <span class="link-icon" v-html="link.icon"></span>
                    <span class="link-name">{{ link.name }}</span>
                  </div>
                  <code class="link-path">{{ getDisplayPath(link.to) }}</code>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 개발자 도구 섹션 추가 -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Developer Tools</h2>
        </div>
        <div class="card-body">
          <ul class="link-list">
            <li>
              <NuxtLink to="/util/jasypt" class="link-item">
                <div class="link-info">
                  <span class="link-icon">🔐</span>
                  <span class="link-name">Jasypt 암/복호화 도구</span>
                </div>
                <code class="link-path">/util/jasypt</code>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 페이지 링크 아이콘 (SVG)
const ICONS = {
  login: '🔑',
  newUser: '👤',
  form: '📝',
  pending: '⏳',
  terms: '📄',
};

// 페이지 그룹 데이터
const pageGroups = ref([
  {
    title: '인증 (Authentication)',
    links: [
      { to: '/sign-in', name: '로그인', icon: ICONS.login },
    ],
  },
  {
    title: '회원가입 (Sign-Up)',
    links: [
      { to: '/sign-up', name: '가입 이메일 인증', icon: ICONS.newUser },
      { to: '/sign-up-form', params: {email:'user@eoground.com'}, name: '가입 정보 입력', icon: ICONS.form },
      { to: '/sign-up-pending', name: '가입 승인 대기', icon: ICONS.pending },
      { to: '/terms-agreement', name: '약관 동의', icon: ICONS.terms },
    ],
  },
  {
    title: '관리자 (Manager)',
    links: [
      { to: '/mg-op/applicant-list', name: '가입신청목록', icon: ICONS.pending },
    ],
  },
]);

/**
 * 쿼리 파라미터가 너무 길 경우, 간략하게 표시합니다.
 * @param path - NuxtLink의 'to' 속성 값
 */
const getDisplayPath = (path: string) => {
  const [base, query] = path.split('?');
  if (query) {
    return `${base}?..`;
  }
  return base;
};
</script>

<style scoped lang="postcss">
/* 페이지 전체 컨테이너 */
.page-container {
  @apply min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8;
}

/* 콘텐츠를 감싸는 메인 래퍼 */
.main-wrapper {
  @apply max-w-4xl mx-auto w-full;
}

/* 헤더 섹션 */
.header-section {
  @apply text-center mb-10;
}
.title {
  @apply text-4xl font-bold text-gray-800 tracking-tight;
}
.subtitle {
  @apply mt-2 text-lg text-gray-600;
}

/* 카드를 담는 그리드 */
.grid-container {
  @apply grid grid-cols-1 md:grid-cols-2 gap-8 mb-8;
}

/* 카드 기본 스타일 */
.card {
  @apply bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1;
}

/* 카드 헤더 */
.card-header {
  @apply bg-gray-50 p-4 border-b border-gray-200;
}
.card-title {
  @apply text-xl font-semibold text-gray-900;
}

/* 카드 바디 */
.card-body {
  @apply p-4;
}

/* 링크 목록 */
.link-list {
  @apply space-y-2;
}

/* 개별 링크 아이템 (NuxtLink) */
.link-item {
  @apply flex items-center justify-between p-3 rounded-lg transition-colors duration-200 hover:bg-blue-50;
}

/* 링크 정보 (아이콘 + 이름) */
.link-info {
  @apply flex items-center space-x-3;
}

/* 링크 아이콘 */
.link-icon {
  @apply text-xl;
}

/* 링크 이름 */
.link-name {
  @apply font-medium text-gray-800;
}

/* 링크 경로 (code 태그) */
.link-path {
  @apply text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded;
}
</style>