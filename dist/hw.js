"use strict";
/* Вам треба створити додаток для управління нотатками, використовуючи принципи ООП, патерн DTO та декоратори.

1. Нотатки
Кожна нотатка має містити:
- ідентифікатор
- назву
- зміст
- дату створення
- дату редагування
- статус
- тип

Нотатки бувають двох типів (використовуйте наслідування):
- Дефолтні.
- Такі, що вимагають підтвердження при редагуванні та видалинні

2. У списку нотаток повинні бути методи для:
- Додавання нового запису.
- Видалення запису за ідентифікатором.
- Редагування запису.
- Отримання повної інформації про нотатку за ідентифікатором.
- Позначення нотатки як "виконаної".
- Отримання статистики: скільки всього нотаток у списку і скільки залишилося невиконаними.
- У списку повинна бути можливість пошуку нотатки за ім'ям або змістом.
- Додайте можливість сортування нотаток за статусом виконання або за часом створення.

3. Робота з даними
Уявіть, що дані надходять до вашого списку із зовнішнього API. Всі вхідні дані приходять у форматі snake_case.
Внутрішня бізнес-логіка вашого додатку та класи повинні суворо використовувати camelCase.

Типізуйте механізм, який автоматично трансформує ключі об'єктів зі snake_case у camelCase при отриманні даних, та навпаки — при поверненні результату клієнту.

4. Декоратори
Для оптимізації та чистоти коду необхідно реалізувати та застосувати наступні декоратори:

@SanitizeInput: Застосовується до методів додавання та редагування. Повинен автоматично видаляти зайві пробіли на початку
та в кінці строк у назві та змісті нотатки перед тим, як дані потраплять до основної логіки методу.

@ValidateNotEmpty: Застосовується після очищення. Нотатки не повинні бути порожніми. Декоратор перевіряє,
чи не є назва та зміст порожніми строками, і якщо так — викидає помилку до виконання основної логіки методу.

@AutoUpdateTimestamp: Застосовується до методу редагування. Декоратор повинен перехоплювати виклик методу
і автоматично оновлювати поле дата редагування поточною датою та часом, звільняючи розробника від необхідності
писати цю логіку всередині самого методу.
*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const mockServerResponse = [
    {
        note_id: '1',
        note_title: 'Прочитати: Великий Гетсбі (Ф. Скотт Фіцджеральд)',
        note_content: 'Проаналізувати мотив «зеленого вогника» та крах американської мрії.',
        created_at: '2026-02-01T10:00:00Z',
        updated_at: '2026-02-02T15:30:00Z',
        is_completed: true,
        type: 'default',
    },
    {
        note_id: '2',
        note_title: 'Купити: На Західному фронті без змін (Е.М. Ремарк)',
        note_content: 'Звернути увагу на контраст між мирним життям та жахами окопів.',
        created_at: '2026-02-05T09:15:00Z',
        updated_at: '2026-02-05T09:15:00Z',
        is_completed: false,
        type: 'confirmation',
    },
    {
        note_id: '3',
        note_title: 'Написати есе: Фієста (Е. Хемінґвей)',
        note_content: 'Розібрати «принцип айсберга» Хемінґвея.',
        created_at: '2026-02-10T14:20:00Z',
        updated_at: '2026-02-12T11:00:00Z',
        is_completed: false,
        type: 'default',
    },
];
function mapToDTO(data) {
    return {
        note_id: data.noteId,
        note_title: data.noteTitle,
        note_content: data.noteContent,
        created_at: data.createdAt,
        updated_at: data.updatedAt,
        is_completed: data.isCompleted,
        type: data.type,
    };
}
function mapFromDTO(data) {
    return {
        noteId: data.note_id,
        noteTitle: data.note_title,
        noteContent: data.note_content,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isCompleted: data.is_completed,
        type: data.type,
    };
}
var NoteStatusEnum;
(function (NoteStatusEnum) {
    NoteStatusEnum["ACTIVE"] = "active";
    NoteStatusEnum["COMPLETED"] = "completed";
})(NoteStatusEnum || (NoteStatusEnum = {}));
var SortByEnum;
(function (SortByEnum) {
    SortByEnum["STATUS"] = "status";
    SortByEnum["CREATED_AT"] = "createdAt";
})(SortByEnum || (SortByEnum = {}));
function sanitizePayload(payload) {
    const nextPayload = { ...payload };
    if ('noteTitle' in nextPayload && typeof nextPayload.noteTitle === 'string') {
        nextPayload.noteTitle = nextPayload.noteTitle.trim();
    }
    if ('noteContent' in nextPayload &&
        typeof nextPayload.noteContent === 'string') {
        nextPayload.noteContent = nextPayload.noteContent.trim();
    }
    return nextPayload;
}
function validatePayload(payload) {
    if ('noteTitle' in payload &&
        payload.noteTitle !== undefined &&
        !payload.noteTitle.trim()) {
        throw new Error('Title cannot be empty');
    }
    if ('noteContent' in payload &&
        payload.noteContent !== undefined &&
        !payload.noteContent.trim()) {
        throw new Error('Content cannot be empty');
    }
}
function SanitizeInput(_target, _propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        const [firstArg, ...restArgs] = args;
        if (typeof firstArg === 'object' && firstArg !== null) {
            const sanitizedArg = sanitizePayload(firstArg);
            return originalMethod.apply(this, [sanitizedArg, ...restArgs]);
        }
        return originalMethod.apply(this, args);
    };
}
function ValidateNotEmpty(_target, _propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        const [firstArg] = args;
        if (typeof firstArg === 'object' && firstArg !== null) {
            validatePayload(firstArg);
        }
        return originalMethod.apply(this, args);
    };
}
function AutoUpdateTimestamp(_target, _propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        const result = originalMethod.apply(this, args);
        if (this && typeof this === 'object' && 'updatedAt' in this) {
            this.updatedAt = new Date().toISOString();
        }
        return result;
    };
}
class BaseNoteEntity {
    constructor(data) {
        this.noteId = data.noteId;
        this.noteTitle = data.noteTitle;
        this.noteContent = data.noteContent;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.isCompleted = data.isCompleted;
        this.type = data.type;
    }
    markAsCompleted() {
        this.isCompleted = true;
        this.updatedAt = new Date().toISOString();
    }
    getStatus() {
        return this.isCompleted ? NoteStatusEnum.COMPLETED : NoteStatusEnum.ACTIVE;
    }
    getInfo() {
        return {
            noteId: this.noteId,
            noteTitle: this.noteTitle,
            noteContent: this.noteContent,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            isCompleted: this.isCompleted,
            status: this.getStatus(),
            type: this.type,
        };
    }
}
class DefaultNoteEntity extends BaseNoteEntity {
    constructor(data) {
        super(data);
    }
    edit(payload) {
        if (payload.noteTitle !== undefined) {
            this.noteTitle = payload.noteTitle;
        }
        if (payload.noteContent !== undefined) {
            this.noteContent = payload.noteContent;
        }
    }
    canDelete() {
        return true;
    }
}
__decorate([
    ValidateNotEmpty,
    SanitizeInput,
    AutoUpdateTimestamp
], DefaultNoteEntity.prototype, "edit", null);
class ConfirmationNoteEntity extends BaseNoteEntity {
    constructor(data) {
        super(data);
    }
    confirmAction(_actionName) {
        return true;
    }
    edit(payload) {
        if (!this.confirmAction('edit')) {
            throw new Error('Edit action was not confirmed');
        }
        if (payload.noteTitle !== undefined) {
            this.noteTitle = payload.noteTitle;
        }
        if (payload.noteContent !== undefined) {
            this.noteContent = payload.noteContent;
        }
    }
    canDelete() {
        return this.confirmAction('delete');
    }
}
__decorate([
    ValidateNotEmpty,
    SanitizeInput,
    AutoUpdateTimestamp
], ConfirmationNoteEntity.prototype, "edit", null);
class NotesList {
    constructor(serverData = []) {
        this.notes = [];
        this.notes = serverData.map((item) => this.createNoteEntity(mapFromDTO(item)));
    }
    createNoteEntity(data) {
        if (data.type === 'confirmation') {
            return new ConfirmationNoteEntity(data);
        }
        return new DefaultNoteEntity(data);
    }
    generateId() {
        const maxId = this.notes.reduce((max, note) => {
            const currentId = Number(note.noteId);
            return Number.isNaN(currentId) ? max : Math.max(max, currentId);
        }, 0);
        return String(maxId + 1);
    }
    findNoteOrThrow(noteId) {
        const note = this.notes.find((item) => item.noteId === noteId);
        if (!note) {
            throw new Error(`Note with id ${noteId} not found`);
        }
        return note;
    }
    addNote(payload) {
        const now = new Date().toISOString();
        const noteData = {
            noteId: this.generateId(),
            noteTitle: payload.noteTitle,
            noteContent: payload.noteContent,
            createdAt: now,
            updatedAt: now,
            isCompleted: false,
            type: payload.type ?? 'default',
        };
        const note = this.createNoteEntity(noteData);
        this.notes.push(note);
        return note.getInfo();
    }
    removeNote(noteId) {
        const note = this.findNoteOrThrow(noteId);
        if (!note.canDelete()) {
            throw new Error('Delete action was not confirmed');
        }
        this.notes = this.notes.filter((item) => item.noteId !== noteId);
    }
    editNote(noteId, payload) {
        const note = this.findNoteOrThrow(noteId);
        note.edit(payload);
        return note.getInfo();
    }
    getNoteById(noteId) {
        return this.findNoteOrThrow(noteId).getInfo();
    }
    getAllNotes() {
        return this.notes.map((note) => note.getInfo());
    }
    markAsCompleted(noteId) {
        const note = this.findNoteOrThrow(noteId);
        note.markAsCompleted();
        return note.getInfo();
    }
    getStats() {
        return {
            total: this.notes.length,
            uncompleted: this.notes.filter((note) => !note.isCompleted).length,
        };
    }
    search(searchValue) {
        const normalizedValue = searchValue.trim().toLowerCase();
        return this.notes
            .filter((note) => {
            return (note.noteTitle.toLowerCase().includes(normalizedValue) ||
                note.noteContent.toLowerCase().includes(normalizedValue));
        })
            .map((note) => note.getInfo());
    }
    sort(by) {
        const cloned = [...this.notes];
        if (by === SortByEnum.STATUS) {
            cloned.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
        }
        if (by === SortByEnum.CREATED_AT) {
            cloned.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }
        return cloned.map((note) => note.getInfo());
    }
    exportToDTO() {
        return this.notes.map((note) => mapToDTO({
            noteId: note.noteId,
            noteTitle: note.noteTitle,
            noteContent: note.noteContent,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
            isCompleted: note.isCompleted,
            type: note.type,
        }));
    }
}
__decorate([
    ValidateNotEmpty,
    SanitizeInput
], NotesList.prototype, "addNote", null);
const notesList = new NotesList(mockServerResponse);
console.log('ALL NOTES');
console.log(notesList.getAllNotes());
console.log('NOTE BY ID = 1');
console.log(notesList.getNoteById('1'));
console.log('ADD NOTE');
console.log(notesList.addNote({
    noteTitle: '   Нова нотатка   ',
    noteContent: '   Новий текст   ',
    type: 'default',
}));
console.log('EDIT NOTE');
console.log(notesList.editNote('1', {
    noteTitle: '   Оновлена назва   ',
    noteContent: '   Оновлений текст   ',
}));
console.log('MARK AS COMPLETED');
console.log(notesList.markAsCompleted('2'));
console.log('SEARCH');
console.log(notesList.search('есе'));
console.log('SORT BY STATUS');
console.log(notesList.sort(SortByEnum.STATUS));
console.log('SORT BY CREATED_AT');
console.log(notesList.sort(SortByEnum.CREATED_AT));
console.log('STATS');
console.log(notesList.getStats());
console.log('EXPORT DTO');
console.log(notesList.exportToDTO());
