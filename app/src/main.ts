import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// GSAPプラグインの登録
gsap.registerPlugin(ScrollTrigger);

// TODOアイテムの型定義
interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

// TODOリストの状態
let todos: TodoItem[] = [];
let nextId = 1;

// DOM要素を初期化
const app = document.querySelector<HTMLDivElement>('#app')!;

// アプリのHTMLを生成
app.innerHTML = `
  <div class="todo-container">
    <h1>GSAPアニメーション TODO</h1>

    <div class="todo-input-container">
      <input type="text" class="todo-input" placeholder="新しいタスクを入力...">
      <button class="add-btn">追加</button>
    </div>

    <div class="todo-list"></div>
  </div>
`;

// 要素の取得
const todoInput = document.querySelector<HTMLInputElement>('.todo-input')!;
const addButton = document.querySelector<HTMLButtonElement>('.add-btn')!;
const todoList = document.querySelector<HTMLDivElement>('.todo-list')!;

// 初期アニメーション
const initAnimation = () => {
  const tl = gsap.timeline();

  tl.from('h1', {
    y: -50,
    opacity: 0,
    duration: 1,
    ease: 'elastic.out(1, 0.5)',
    onComplete: () => {
      gsap.to('h1', { opacity: 1 });
    }
  });

  tl.from('.todo-input-container', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.7)',
    onComplete: () => {
      gsap.to('.todo-input-container', { opacity: 1 });
    }
  }, '-=0.5');

  // ボタンのホバーアニメーション
  const buttons = gsap.utils.toArray('button') as HTMLElement[];
  buttons.forEach((button) => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.2,
        ease: 'power1.out'
      });
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.2,
        ease: 'power1.in'
      });
    });
  });

  // タイトルの背景アニメーション
  gsap.to('h1', {
    backgroundPosition: '200% center',
    repeat: -1,
    duration: 8,
    ease: 'linear'
  });
};

// ランダムな色生成
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

// ランダムアニメーション効果
const getRandomEffect = () => {
  const effects = ['back.out(1.7)', 'elastic.out(1, 0.3)', 'bounce.out', 'power4.out'];
  return effects[Math.floor(Math.random() * effects.length)];
};

// TODOアイテムの追加
const addTodo = () => {
  const text = todoInput.value.trim();
  if (text === '') return;

  const newTodo: TodoItem = {
    id: nextId++,
    text,
    completed: false
  };

  todos.push(newTodo);
  renderTodo(newTodo);
  todoInput.value = '';

  // 入力欄のフォーカスを再設定
  todoInput.focus();

  // 追加時の特殊エフェクト
  gsap.to('.todo-container', {
    backgroundColor: `rgba(100, 108, 255, 0.05)`,
    duration: 0.3,
    yoyo: true,
    repeat: 1
  });
};

// TODOアイテムの削除
const deleteTodo = (id: number) => {
  const todoElement = document.querySelector(`.todo-item[data-id="${id}"]`);
  if (!todoElement) return;

  // 削除アニメーション
  gsap.to(todoElement, {
    x: '100vw',
    opacity: 0,
    duration: 0.5,
    ease: 'power2.in',
    onComplete: () => {
      todos = todos.filter(todo => todo.id !== id);
      todoElement.remove();
      updateScrollAnimation();
    }
  });
};

// TODOアイテムの完了状態の切り替え
const toggleComplete = (id: number) => {
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex === -1) return;

  const todo = todos[todoIndex];
  todo.completed = !todo.completed;

  const todoElement = document.querySelector(`.todo-item[data-id="${id}"]`) as HTMLElement | null;
  const todoText = todoElement?.querySelector('.todo-text');

  if (todo.completed) {
    todoElement?.classList.add('completed');
    todoText?.classList.add('completed');

    // 完了アニメーション
    if (todoText) {
      gsap.fromTo(todoText,
        { textDecoration: 'none', opacity: 1 },
        {
          textDecoration: 'line-through',
          opacity: 0.6,
          duration: 0.3,
          ease: 'power1.inOut'
        }
      );

      // 完了時のお祝いアニメーション
      const tl = gsap.timeline();

      // キラキラエフェクト
      for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.backgroundColor = getRandomColor();
        document.body.appendChild(particle);

        const size = Math.random() * 10 + 5;
        const startX = todoElement ? todoElement.getBoundingClientRect().left + todoElement.offsetWidth / 2 : 0;
        const startY = todoElement ? todoElement.getBoundingClientRect().top + todoElement.offsetHeight / 2 : 0;

        tl.to(particle, {
          x: startX + (Math.random() - 0.5) * 200,
          y: startY + (Math.random() - 0.5) * 200,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          onComplete: () => {
            particle.remove();
          }
        }, i * 0.02);
      }
    }
  } else {
    todoElement?.classList.remove('completed');
    todoText?.classList.remove('completed');

    // 未完了に戻すアニメーション
    if (todoText) {
      gsap.fromTo(todoText,
        { textDecoration: 'line-through', opacity: 0.6 },
        {
          textDecoration: 'none',
          opacity: 1,
          duration: 0.3,
          ease: 'power1.inOut'
        }
      );
    }
  }
};

// TODOアイテムのレンダリング
const renderTodo = (todo: TodoItem) => {
  const todoElement = document.createElement('div');
  todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
  todoElement.setAttribute('data-id', todo.id.toString());

  todoElement.innerHTML = `
    <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
    <div class="todo-actions">
      <button class="complete-btn">✓</button>
      <button class="delete-btn">×</button>
    </div>
  `;

  // 完了ボタンのイベント
  const completeBtn = todoElement.querySelector('.complete-btn');
  completeBtn?.addEventListener('click', () => {
    toggleComplete(todo.id);
  });

  // 削除ボタンのイベント
  const deleteBtn = todoElement.querySelector('.delete-btn');
  deleteBtn?.addEventListener('click', () => {
    deleteTodo(todo.id);
  });

  todoList.appendChild(todoElement);

  // 追加アニメーション
  gsap.fromTo(todoElement,
    { x: '-100vw', opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.5,
      ease: getRandomEffect(),
    }
  );

  // スクロールアニメーションの更新
  setTimeout(() => {
    updateScrollAnimation();
  }, 100);
};

// スクロールアニメーションの設定
const updateScrollAnimation = () => {
  // 以前のスクロールトリガーをクリア
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

  // 新しいスクロールトリガーを設定
  const todoItems = gsap.utils.toArray('.todo-item') as HTMLElement[];

  todoItems.forEach((item, index) => {
    // 各アイテムのスクロールエフェクト
    gsap.fromTo(item,
      { scale: 0.9, opacity: 0.7 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        scrollTrigger: {
          trigger: item,
          start: 'top bottom-=100',
          end: 'bottom top+=100',
          toggleActions: 'play none none reverse',
          markers: false
        }
      }
    );

    // 各アイテムの背景色変更エフェクト
    gsap.to(item, {
      backgroundColor: index % 2 === 0
        ? 'rgba(100, 108, 255, 0.15)'
        : 'rgba(100, 108, 255, 0.05)',
      scrollTrigger: {
        trigger: item,
        start: 'top center',
        end: 'bottom center',
        toggleActions: 'play reverse play reverse',
        markers: false
      }
    });
  });
};

// イベントリスナーの設定
addButton.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo();
  }
});

// 追加ボタンのクリックアニメーション
addButton.addEventListener('click', (e) => {
  gsap.to(addButton, {
    scale: 0.95,
    duration: 0.1,
    onComplete: () => {
      gsap.to(addButton, {
        scale: 1,
        duration: 0.1
      });
    }
  });
});

// シェイクアニメーション（空の入力時）
todoInput.addEventListener('invalid', () => {
  gsap.fromTo(todoInput,
    { x: 0 },
    {
      x: "10px",
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: "rough({ template: none.out, strength: 1, points: 20, taper: none, randomize: true, clamp: false })"
    }
  );
});

// ダミーデータの追加（テスト用）
const addDummyTodos = () => {
  const dummyTodos = [
    'GSAPアニメーションを勉強する',
    'TODOアプリのデザインを考える',
    '買い物に行く',
    '本を読む',
    '散歩する',
    'コーディングの練習',
    'プロジェクトを仕上げる'
  ];

  dummyTodos.forEach((text, index) => {
    setTimeout(() => {
      const newTodo: TodoItem = {
        id: nextId++,
        text,
        completed: false
      };
      todos.push(newTodo);
      renderTodo(newTodo);
    }, index * 300);
  });
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  initAnimation();
  todoInput.focus();

  // テスト用ダミーデータ（コメントアウトすることでテストデータ表示を止められます）
  // addDummyTodos();

  // GSAPの改善TODO項目を追加
  addGSAPTodos();
});

// GSAPの改善TODO項目を追加
const addGSAPTodos = () => {
  const gsapTodos = [
    'タスク追加/削除時のスライドアニメーション改善',
    'タスク完了時のチェックマークアニメーション強化',
    '優先度変更時の色変化トランジション実装',
    'ドラッグ＆ドロップでの並べ替えアニメーション',
    'カテゴリ切替時のトランジション効果',
    '期限切れタスクの強調表示アニメーション',
    'スワイプジェスチャーのモバイル対応アニメーション'
  ];

  gsapTodos.forEach((text, index) => {
    setTimeout(() => {
      const newTodo: TodoItem = {
        id: nextId++,
        text,
        completed: false
      };
      todos.push(newTodo);
      renderTodo(newTodo);
    }, index * 300);
  });
};
