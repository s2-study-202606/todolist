import { auth, db } from '../firebase/config.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    
    let currentUser = null;
    
    // 윤리 가이드 게이트 로직
    const ethicsOverlay = document.getElementById('ethics-overlay');
    const ethicsAgreeBtn = document.getElementById('ethics-agree-btn');
    
    if (ethicsOverlay && ethicsAgreeBtn) {
        const hasAgreed = localStorage.getItem('ethicsAgreed') === 'true';
        if (!hasAgreed) {
            // 아직 동의하지 않았다면 오버레이 표시
            ethicsOverlay.classList.remove('hidden');
        }

        ethicsAgreeBtn.addEventListener('click', () => {
            // 버튼 클릭 시 로컬 스토리지에 동의 여부 저장 및 모달 숨김
            localStorage.setItem('ethicsAgreed', 'true');
            ethicsOverlay.classList.add('hidden');
        });
    }
    // 로컬 스토리지에서 교사 여부 확인
    const isTeacher = localStorage.getItem('isTeacher') === 'true';

    if (isTeacher) {
        // 교사 로그인 우회 처리 (가짜 고유 ID 부여)
        currentUser = { uid: 'teacher-admin-uid-1234' };
        loadTodos();
    } else {
        // 학생(일반 Firebase 유저) 인증 상태 감지
        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUser = user;
                loadTodos(); 
            } else {
                // 로그인되어 있지 않으면 로그인 페이지로 이동
                if (window.location.pathname !== '/login.html') {
                    window.location.href = '/login.html';
                }
            }
        });
    }

    // 로그아웃 로직
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (isTeacher) {
                // 교사 로그아웃 시 로컬 스토리지 데이터만 삭제
                localStorage.removeItem('isTeacher');
                window.location.href = '/login.html';
            } else {
                // 학생 로그아웃 (Firebase)
                try {
                    await signOut(auth);
                    window.location.href = '/login.html';
                } catch (error) {
                    console.error("로그아웃 실패:", error);
                }
            }
        });
    }

    // 할 일 불러오기 (Read)
    function loadTodos() {
        if (!currentUser || !todoList) return;

        const q = query(collection(db, `users/${currentUser.uid}/todos`), orderBy("createdAt", "desc"));
        
        onSnapshot(q, (snapshot) => {
            todoList.innerHTML = '';
            snapshot.forEach((docSnap) => {
                const todo = docSnap.data();
                renderTodo(docSnap.id, todo);
            });
        });
    }

    // 할 일 화면에 그리기
    function renderTodo(id, todo) {
        const li = document.createElement('li');
        
        const span = document.createElement('span');
        span.textContent = todo.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', () => deleteTodo(id));

        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    }

    // 할 일 추가 (Create)
    if (addTodoBtn && todoInput) {
        addTodoBtn.addEventListener('click', async () => {
            const text = todoInput.value.trim();
            if (!text || !currentUser) return;

            try {
                await addDoc(collection(db, `users/${currentUser.uid}/todos`), {
                    text: text,
                    createdAt: new Date()
                });
                todoInput.value = ''; // 입력창 초기화
            } catch (error) {
                console.error("추가 실패:", error);
                alert("할 일 추가 중 오류가 발생했습니다. (Firebase 보안 규칙을 확인하세요)");
            }
        });
    }

    // 할 일 삭제 (Delete)
    async function deleteTodo(id) {
        if (!currentUser) return;
        try {
            await deleteDoc(doc(db, `users/${currentUser.uid}/todos`, id));
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    }
});
