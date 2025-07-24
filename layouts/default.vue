<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 영역 -->
    <AppHeader v-if="sessionState.managerState" />

    <!-- 메인 컨텐츠 영역 -->
    <div v-if="sessionState.managerState" class="flex h-[calc(100vh-4rem)]">
      <AppSidebar />

      <!-- 페이지 영역 -->
      <main class="flex-1 bg-white overflow-y-auto">
        <div class="p-6">
          <slot />
        </div>
      </main>
    </div>

    <!-- 로그인되지 않은 경우 전체 페이지 표시 -->
    <div v-else>
      <!-- 로그인 페이지는 헤더나 사이드바가 없으므로 slot만 렌더링합니다 -->
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSessionStore } from '~/stores/session';

// Pinia 스토어에서 세션 상태를 가져옵니다.
const { sessionState } = useSessionStore();

// 참고: AppHeader, AppSidebar는 Nuxt3의 auto-import 기능으로 자동 로드됩니다.
</script>