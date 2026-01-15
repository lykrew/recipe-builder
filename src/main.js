import add from './commands/add.js';
import remove from './commands/remove.js';
import replace from './commands/replace.js';
import exists from './commands/exists.js';
import listCmd from './commands/list.js';
import unique from './commands/unique.js';
import sortRecipe from './commands/sort.js';
import merge from './commands/merge.js';
import findCmd from './commands/find.js';
import stringify from './commands/stringify.js';

import readline from 'readline';

// Создаём интерфейс readline для интерактивного ввода/вывода
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

// `recipe` содержит текущий список ингредиентов (массив строк).
// Модули команд должны возвращать НОВЫЕ массивы, поэтому мы переназначаем `recipe`.
let recipe = [];

// `history` — стек предыдущих состояний `recipe` для команды `undo`.
const history = [];

// Вспомогательная функция: сохраняет поверхностную копию текущего рецепта в историю.
// Вызывается до изменения `recipe`.
const pushHistory = () => history.push(recipe.slice());

// Приветственное сообщение и вывод приглашения
console.log('Recipe Builder — enter commands, `quit` to exit');
rl.prompt();

rl.on('line', (line) => {
  // Считываем и очищаем входную строку
  const raw = line.trim();
  if (!raw) return rl.prompt();

  // Разделяем первую часть как команду, остальное — аргументы в одну строку
  const [cmd, ...rest] = raw.split(' ');
  const args = rest.join(' ').trim();

  try {
    switch (cmd) {
      // add <ingredient>
      // - сохраняет текущее состояние в историю
      // - вызывает модуль `add`, который должен вернуть НОВЫЙ массив с добавленным ингредиентом
      case 'add': {
        if (!args) { console.log('ERROR: missing ingredient'); break; }
        pushHistory();
        recipe = add(recipe, args);
        console.log('OK');
        break;
      }

      // remove <ingredient>
      // - `remove` возвращает НОВЫЙ массив без первого вхождения
      // - если длина не изменилась, считаем, что элемент не найден
      case 'remove': {
        if (!args) { console.log('ERROR: missing ingredient'); break; }
        const res = remove(recipe, args);
        if (res.length === recipe.length) console.log('NOT FOUND'); else { pushHistory(); recipe = res; console.log('OK'); }
        break;
      }

      // replace <old> <new>
      // - разбирает два токена (старое и новое значение)
      // - `replace` возвращает НОВЫЙ массив, где первое вхождение заменено
      case 'replace': {
        const parts = args.split(' ').filter(Boolean);
        if (parts.length < 2) { console.log('ERROR: replace requires old and new'); break; }
        const [oldVal, newVal] = parts;
        const res = replace(recipe, oldVal, newVal);
        // If result is identical to current recipe, treat as NOT FOUND
        if (res === recipe || res.length === recipe.length && res.every((v,i)=>v===recipe[i])) console.log('NOT FOUND'); else { pushHistory(); recipe = res; console.log('OK'); }
        break;
      }

      // exists <ingredient> — возвращает YES или NO
      case 'exists': {
        if (!args) { console.log('ERROR: missing ingredient'); break; }
        console.log(exists(recipe, args) ? 'YES' : 'NO');
        break;
      }

      // list — печатает пронумерованный список или EMPTY
      case 'list': {
        const out = listCmd(recipe);
        if (!out || out.length === 0) console.log('EMPTY'); else console.log(out);
        break;
      }

      // unique — удалить дубликаты, сохранить в истории
      case 'unique': {
        pushHistory();
        recipe = unique(recipe);
        console.log('OK');
        break;
      }

      // sort <asc|desc> — проверяет направление, затем сохраняет и применяет
      case 'sort': {
        const dir = args || '';
        if (dir !== 'asc' && dir !== 'desc') { console.log('ERROR: unknown direction'); break; }
        pushHistory();
        recipe = sortRecipe(recipe, dir);
        console.log('OK');
        break;
      }

      // merge <csv> — модуль парсит csv и объединяет элементы
      case 'merge': {
        if (!args) { console.log('ERROR: missing csv list'); break; }
        pushHistory();
        recipe = merge(recipe, args);
        console.log('OK');
        break;
      }

      // find <substring> — поиск без учёта регистра, печатает найденные элементы или EMPTY
      case 'find': {
        if (!args) { console.log('ERROR: missing substring'); break; }
        const found = findCmd(recipe, args);
        if (!found || found.length === 0) console.log('EMPTY'); else console.log(found.join('\n'));
        break;
      }

      // stringify — печатает строку-список ингредиентов через запятую
      case 'stringify': {
        console.log(stringify(recipe));
        break;
      }

      // undo — восстанавливает предыдущее состояние из стека истории
      case 'undo': {
        if (history.length === 0) { console.log('EMPTY'); break; }
        recipe = history.pop();
        console.log('OK');
        break;
      }

      case 'quit': {
        rl.close();
        return;
      }
      default:
        // Неизвестная команда — сообщаем пользователю
        console.log('ERROR: unknown command');
    }
  } catch (err) {
    // Ловим и выводим любые неожиданные ошибки, чтобы CLI не падал
    console.log('ERROR:', err.message || String(err));
  }

  rl.prompt();
}).on('close', () => {
  console.log('Bye');
  process.exit(0);
});
