import { auth } from '../firebase/config.js';
import { createUserWithEmailAndPassword } from "firebase/auth";

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("학생 회원가입 성공:", userCredential.user);
            alert("회원가입이 완료되었습니다. 로그인해주세요.");
            window.location.href = '/login.html'; // 회원가입 후 로그인 폼에서 로그인하도록
        } catch (error) {
            console.error("회원가입 실패:", error);
            alert("회원가입 실패: " + error.message);
        }
    });
});
