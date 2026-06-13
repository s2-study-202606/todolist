import { auth } from '../firebase/config.js';
import { signInWithEmailAndPassword } from "firebase/auth";

// Vite 환경 변수에서 교사 정보 가져오기
const ADMIN_ID = import.meta.env.VITE_TEACHER_ID;
const ADMIN_PW = import.meta.env.VITE_TEACHER_PW;

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // 하드코딩된 교사 로그인 우회 (Bypass)
        if (email === ADMIN_ID && password === ADMIN_PW) {
            console.log("교사 로그인 성공 (로컬 스토리지 우회)");
            localStorage.setItem('isTeacher', 'true');
            window.location.href = '/index.html';
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("학생(일반) 로그인 성공:", userCredential.user);
            // 학생 로그인이므로 교사 플래그를 지워줌
            localStorage.removeItem('isTeacher');
            window.location.href = '/index.html'; 
        } catch (error) {
            console.error("로그인 실패:", error);
            alert("로그인 실패: " + error.message);
        }
    });
});
