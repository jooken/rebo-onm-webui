// stores/session.ts
import { defineStore } from 'pinia'

// 세션 상태에 대한 인터페이스 정의
interface SessionState {
  managerState: boolean;
  managerName: string | null;
  managerId: string | null;
}

export const useSessionStore = defineStore('session', {
  // 상태(state) 정의
  state: (): { sessionState: SessionState } => ({
    sessionState: {
      managerState: true, // 개발 편의를 위해 기본값을 true로 설정합니다. 실제로는 false여야 합니다.
      managerName: '쿼바타', // 예시 사용자 이름
      managerId: 'quavatar_admin',
    },
  }),

  // 액션(actions) 정의: 상태를 변경하는 메소드
  actions: {
    // 로그인 처리
    signIn(name: string, id: string) {
      this.sessionState.managerState = true;
      this.sessionState.managerName = name;
      this.sessionState.managerId = id;
    },
    // 로그아웃 처리
    signOut() {
      this.sessionState.managerState = false;
      this.sessionState.managerName = null;
      this.sessionState.managerId = null;
    },
  },
})