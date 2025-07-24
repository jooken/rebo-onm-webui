<template>
  <aside class="w-64 bg-white border-r border-gray-200 h-full">
    <!-- 메뉴바 상단 영역 -->
    <div class="bg-gray-100 p-4 border-b border-gray-200">
      <h2 class="text-sm text-gray-800">{{ sessionState.managerName }} 님 접속</h2>
    </div>

    <!-- 메뉴 리스트 -->
    <nav class="flex-1 overflow-y-auto">
      <div v-for="menu in sidebarMenus" :key="menu.id">
        <!-- 메인 메뉴 -->
        <div class="sidebar-menu-item flex items-center justify-between cursor-pointer" @click="toggleMenu(menu)">
          <NuxtLink :to="menu.path" class="flex-1">
            {{ menu.title }}
          </NuxtLink>
          <button v-if="menu.children" class="ml-2 p-1 hover:bg-gray-200 rounded">
            <!-- 아이콘 회전 효과를 위한 클래스 바인딩 -->
            <span :class="['transition-transform', { 'rotate-90': expandedMenus.includes(menu.id) }]">▶</span>
          </button>
        </div>

        <!-- 서브메뉴 (transition으로 부드러운 효과 추가) -->
        <transition name="slide-fade">
          <div v-if="menu.children && expandedMenus.includes(menu.id)">
            <NuxtLink v-for="submenu in menu.children" :key="submenu.id" :to="submenu.path"
                      class="sidebar-submenu-item block">
              {{ submenu.title }}
            </NuxtLink>
          </div>
        </transition>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSessionStore } from '~/stores/session';

// Pinia 스토어에서 세션 상태 가져오기
const { sessionState } = useSessionStore();

// 사이드바 메뉴 타입 정의 (서브메뉴 포함)
interface SidebarMenu {
  id: number;
  title: string;
  path: string;
  children?: SidebarMenu[];
}

// 사이드바 메뉴 데이터
const sidebarMenus: SidebarMenu[] = [
  {
    id: 1, title: '운영자 관리', path: '/mg-op', children: [
      { id: 101, title: '가입신청관리', path: '/mg-op/applicant-list' },
      { id: 102, title: '운영자목록', path: '/mg-op/op-list' }
    ]
  },
  {
    id: 2,
    title: '데이터 분석',
    path: '/analytics', // 부모 메뉴 자체도 링크가 필요할 경우
    children: [
      { id: 201, title: '사용량 통계', path: '/analytics/usage' },
      { id: 202, title: '오류 리포트', path: '/analytics/errors' },
    ],
  },
  { id: 3, title: '고객 지원', path: '/support' },
];

// 확장된 메뉴 ID를 추적하는 반응형 상태
const expandedMenus = ref<number[]>([]);

// 메뉴 토글 함수
const toggleMenu = (menu: SidebarMenu) => {
  // 서브메뉴가 없는 경우 함수 종료
  if (!menu.children) return;

  const menuId = menu.id;
  const index = expandedMenus.value.indexOf(menuId);

  if (index > -1) {
    // 이미 열려있으면 닫기
    expandedMenus.value.splice(index, 1);
  } else {
    // 닫혀있으면 열기
    expandedMenus.value.push(menuId);
  }
};
</script>

<style scoped>
/* 기본적인 메뉴 아이템 스타일 */
.sidebar-menu-item, .sidebar-submenu-item {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #374151; /* gray-700 */
}

.sidebar-menu-item:hover, .sidebar-submenu-item:hover {
  background-color: #f3f4f6; /* gray-100 */
}

.sidebar-submenu-item {
  padding-left: 2rem; /* 서브메뉴 들여쓰기 */
  font-size: 0.8rem;
  color: #4b5563; /* gray-600 */
}

/* 활성화된 링크 스타일 */
.router-link-exact-active {
  background-color: #e0e7ff; /* indigo-100 */
  color: #3730a3; /* indigo-800 */
  font-weight: 600;
}

/* 서브메뉴 슬라이드 효과 */
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>