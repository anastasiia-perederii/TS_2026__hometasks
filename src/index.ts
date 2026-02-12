//1/ Визначте інтерфейс, який використовує сигнатуру індексу з типами об'єднання.
// Наприклад, тип значення для кожного ключа може бути число | рядок.

interface StringOrNumberDictionary {
    [key: string]: number | string;
}

const dictionaryExample: StringOrNumberDictionary = {
    name: "Anastasiia",
    age: 28,
    country: "Ukraine",
};

//2/ Створіть інтерфейс, у якому типи значень у сигнатурі індексу є функціями.
// Ключами можуть бути рядки, а значеннями — функції, які приймають будь-які аргументи.

type AnyFunction = (...args: unknown[]) => unknown;

interface FunctionDictionary {
    [key: string]: AnyFunction;
}

const functionsExample: FunctionDictionary = {
    sum: (...args: unknown[]) => {
        const [a, b] = args as [number, number];
        return a + b;
    },
    greet: (...args: unknown[]) => {
        const [name] = args as [string];
        return `Hello, ${name}`;
    },
};

//3/ Опишіть інтерфейс, який використовує сигнатуру індексу для опису об'єкта, подібного до масиву.
// Ключі повинні бути числами, а значення - певного типу.

interface StringArrayLike {
    [index: number]: string;
}

const arrayLikeExample: StringArrayLike = {
    0: "first",
    1: "second",
    2: "third",
};

//4/ Створіть інтерфейс з певними властивостями та індексною сигнатурою.
// Наприклад, ви можете мати властивості типу
// name: string та індексну сигнатуру для додаткових динамічних властивостей.

interface UserProfile {
    name: string;
    age: number;
    [key: string]: string | number;
}

const profile: UserProfile = {
    name: "Anastasiia",
    age: 28,
    city: "Kyiv",
    experience: 2,
};

//5/ Створіть два інтерфейси, один з індексною сигнатурою,
// а інший розширює перший, додаючи специфічні властивості.

interface BaseDictionary {
    [key: string]: number;
}

interface ExtendedDictionary extends BaseDictionary {
    total: number;
    count: number;
}

const stats: ExtendedDictionary = {
    total: 100,
    count: 2,
    apples: 40,
    oranges: 60,
};

//6/ Напишіть функцію, яка отримує об'єкт з індексною сигнатурою і перевіряє,
// чи відповідають значення певних ключів певним критеріям (наприклад, чи всі значення є числами).

function areAllValuesNumbers(obj: Record<string, unknown>): boolean {
    for (const key in obj) {
        if (typeof obj[key] !== "number") {
            return false;
        }
    }
    return true;
}

const data1 = { a: 1, b: 2, c: 3 };
const data2 = { a: 1, b: "text", c: 3 };

console.log(areAllValuesNumbers(data1));
console.log(areAllValuesNumbers(data2));
