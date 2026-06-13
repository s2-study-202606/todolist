import { auth, db } from '../firebase/config.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    
    let currentUser = null;

    // 인증 상태 감지
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            loadTodos(); // 로그인된 경우 할 일 목록 불러오기
        } else {
            // 로그인되어 있지 않으면 로그인 페이지로 이동
            if (window.location.pathname !== '/login.html') {
                window.location.href = '/login.html';
            }
        }
    });

    // 로그아웃 로직
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = '/login.html';
            } catch (error) {
                console.error("로그아웃 실패:", error);
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
