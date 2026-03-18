const form = document.getElementById('telegramForm');
const loading = document.getElementById('loading');
const message = document.getElementById('message');

const BOT_TOKEN = '8792828862:AAEUoHc06sXI1cG6OfIdRfZ0kSHiOwEMp9c';
const CHAT_IDS = ['722433913', '1538180433'];

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  console.log('=== ПРОВЕРКА ФОРМЫ ===');

  // Проверка Chat ID(ов)
  if (!Array.isArray(CHAT_IDS) || CHAT_IDS.length === 0 || CHAT_IDS.some(id => !id || id === 'ВАШ_РЕАЛЬНЫЙ_CHAT_ID' || id === 'ВТОРОЙ_CHAT_ID')) {
    showMessage('❌ Ошибка: Не настроен(ы) Chat ID получателей.', 'error');
    return;
  }

  // Валидация формы
  const nameInput = document.getElementById('name');
  const attendanceRadio = document.querySelector('input[name="attendance"]:checked');

  if (!nameInput.value.trim()) {
    showMessage('❌ Пожалуйста, введите имя и фамилию', 'error');
    nameInput.focus();
    return;
  }

  if (!attendanceRadio) {
    showMessage('❌ Пожалуйста, выберите вариант присутствия', 'error');
    return;
  }

  // Показать загрузку
  loading.classList.remove('hidden');
  message.classList.add('hidden');

  // Сбор данных
  const name = nameInput.value.trim();
  const attendance = attendanceRadio.value;


  const drinkCheckboxes = document.querySelectorAll('input[name="drinks"]:checked');
  const drinks = Array.from(drinkCheckboxes).map(cb => cb.value);
  const drinksCustom = document.getElementById('drinks_custom')?.value.trim();

  if (drinksCustom) {
    drinks.push(drinksCustom);
  }

  const drinksText = drinks.length > 0 ? drinks.join(', ') : 'Не указано';

  // Формирование сообщения
  const telegramMessage = `
🎉 НОВЫЙ ОТВЕТ НА ПРИГЛАШЕНИЕ

👤 Имя: ${name}
✅ Присутствие: ${attendance}
🥂 Напитки: ${drinksText}

📅 Дата: ${new Date().toLocaleString('ru-RU')}
        `;

  console.log('Отправляемые данные:', { name, attendance, drinksText });

  try {
    // Отправка в Telegram всем получателям
    const responses = await sendToTelegram(telegramMessage);
    console.log('Ответы Telegram:', responses);

    const isAnyOk = responses.some(res => res && res.ok);

    if (isAnyOk) {
      showMessage('✅ Ваш ответ успешно отправлен! Организатор получил уведомление.', 'success');
      form.reset();
    } else {
      // Обработка ошибок Telegram
      let errorMsg = '❌ Ошибка отправки: ';

      const firstError = responses.find(res => res && !res.ok);
      if (firstError) {
        if (firstError.error_code === 400) {
          errorMsg += 'Неверный Chat ID у одного из получателей. ';
        } else if (firstError.error_code === 403) {
          errorMsg += 'Бот не добавлен в один из чатов. Добавьте бота в чат или отправьте ему /start. ';
        }
        errorMsg += firstError.description || 'Неизвестная ошибка';
      } else {
        errorMsg += 'Не удалось отправить сообщение ни одному получателю.';
      }

      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('Ошибка:', error);
    showMessage(error.message, 'error');
  } finally {
    loading.classList.add('hidden');
  }
});

async function sendToTelegram(message) {
  const encodedMessage = encodeURIComponent(message);

  const requests = CHAT_IDS.map(chatId => {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${encodedMessage}`;

    console.log('URL запроса (без токена):',
      `https://api.telegram.org/bot[TOKEN]/sendMessage?chat_id=${chatId}&text=...`);

    return fetch(url)
      .then(res => res.json())
      .catch(error => {
        console.error('Fetch error for chat', chatId, error);
        return { ok: false, description: 'Проблема с интернет-соединением' };
      });
  });

  return Promise.all(requests);
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type}`;
  message.classList.remove('hidden');

  // Для ошибок с Chat ID не скрываем автоматически
  if (!text.includes('Chat ID')) {
    setTimeout(() => {
      message.classList.add('hidden');
    }, 8000);
  }
}
