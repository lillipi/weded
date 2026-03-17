const marqueeElement = document.getElementById('marqueeText');
const text = 'вы приглашены';
const repeatCount = 15;

let repeatedText = '';
for (let i = 0; i < repeatCount; i++) {
  repeatedText += `<span class="text-item">${text}</span>`;
}

marqueeElement.innerHTML = `<span>${repeatedText}</span><span>${repeatedText}</span>`;
