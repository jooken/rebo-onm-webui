<template>
  <header class="bg-white border-b border-gray-200 shadow-sm">
    <div class="flex items-center justify-between h-16 px-4">
      <!-- 홈페이지명 -->
      <div class="flex items-center">
        <NuxtLink to="/" class="text-lg font-bold text-gray-900 hover:text-blue-600">
          Quavatar O&M
        </NuxtLink>
      </div>

      <!-- 중앙 기능 메뉴 -->
      <nav class="flex space-x-8">
        <NuxtLink v-for="menu in headerMenus" :key="menu.id" :to="menu.path" class="header-menu-item">
          {{ menu.title }}
        </NuxtLink>
      </nav>

      <!-- 우측 아이콘 메뉴 -->
      <div class="flex items-center space-x-3">
        <NuxtLink v-for="icon in iconMenus" :key="icon.id" :to="icon.path" class="icon-menu-item" :title="icon.title">
          {{ icon.icon }}
        </NuxtLink>

        <!-- 로그아웃 버튼 -->
        <button @click="signOut"
                class="ml-4 px-4 py-2 text-sm font-medium text-gray-400 bg-white outline outline-gray-200 hover:bg-gray-200 rounded"
                title="로그아웃">
          로그아웃
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useSessionStore } from '~/stores/session';

// 메뉴 데이터 타입 정의
interface HeaderMenu {
  id: number;
  title: string;
  path: string;
}

interface IconMenu {
  id: number;
  title: string;
  path: string;
  icon: string;
}

// 헤더 메뉴 데이터
const headerMenus: HeaderMenu[] = [
  { id: 1, title: '대시보드', path: '/dashboard' },
  { id: 2, title: '사용자 관리', path: '/users' },
  { id: 3, title: '시스템 설정', path: '/settings' },
];

// 아이콘 메뉴 데이터
const iconMenus: IconMenu[] = [
  { id: 1, title: '알림', path: '/notifications', icon: '🔔' },
  { id: 2, title: '계정 정보', path: '/account', icon: '⚙️' },
];

// 세션 스토어 사용
const sessionStore = useSessionStore();

// 로그아웃 처리 함수
const signOut = async () => {
  // 스토어의 로그아웃 액션 호출
  sessionStore.signOut();
  // Nuxt의 navigateTo 유틸리티를 사용하여 로그인 페이지로 리디렉션
  await navigateTo('/sign-in');
};
</script>

<style scoped>
/* 활성화된 메뉴 스타일 예시 (NuxtLink의 기능 활용) */
.header-menu-item.router-link-active {
  color: #2563eb; /* blue-600 */
  font-weight: 600;
}
</style>