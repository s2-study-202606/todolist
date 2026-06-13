import { auth } from '../firebase/config.js';
import { signInWithEmailAndPassword } from "firebase/auth";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("교사 로그인 성공:", userCredential.user);
            window.location.href = '/index.html'; // 로그인 성공 시 할 일 목록으로 이동
        } catch (error) {
            console.error("로그인 실패:", error);
            alert("로그인 실패: " + error.message);
        }
    });
});
