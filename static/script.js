let currentInput = '';

function updateDisplay() {
    document.getElementById('display').textContent = currentInput || '0';
}

function clearInput() {
    currentInput = '';
    updateDisplay();
}

function handleNumber(num) {
    if (num === '.') {
        const parts = currentInput.split(/[\+\-\*\/]/);
        const lastNumber = parts[parts.length - 1];
        if (lastNumber.includes('.')) return;
    }
    currentInput += num;
    updateDisplay();
}

function handleOperator(op) {
    if (currentInput === '') return;
    if (['+', '-', '*', '/'].includes(currentInput.slice(-1))) {
        currentInput = currentInput.slice(0, -1) + op;
    } else {
        currentInput += op;
    }
    updateDisplay();
}

function calculateResult() {
    try {
        // Prevent invalid expressions like ending in operator
        if (/[\+\-\*\/]$/.test(currentInput)) {
            currentInput = 'Error';
        } else {
            // Replace double operators (like 5--2) safely
            const safeExpression = currentInput.replace(/[^0-9\.\+\-\*\/]/g, '');

            const result = new Function(`return ${safeExpression}`)();

            // Check for division by zero
            if (result === Infinity || result === -Infinity) {
                currentInput = 'Cannot divide by 0';
                updateDisplay();
                setTimeout(clearInput, 1500);
                return;
            }

            if (isNaN(result)) {
                currentInput = 'Error';
            } else {
                currentInput = result.toString();
            }
        }

        updateDisplay();
    } catch (error) {
        currentInput = 'Error';
        updateDisplay();
        setTimeout(clearInput, 1500);
    }
}

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        const id = button.id;

        if (id === 'num-clear-0') {
            clearInput();
        } else if (id === 'num-decimal') {
            handleNumber('.');
        } else if (id === 'symbols-plus') {
            handleOperator('+');
        } else if (id === 'symbols-minus') {
            handleOperator('-');
        } else if (id === 'symbols-multi') {
            handleOperator('*');
        } else if (id === 'symbols-divide') {
            handleOperator('/');
        } else if (id === 'symbols-equal') {
            calculateResult();
        } else if (
            id.startsWith('num-') &&
            !id.includes('decimal') &&
            !id.includes('clear')
        ) {
            handleNumber(button.textContent);
        }
    });
});

updateDisplay();
