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

const mockServerResponse: NoteServerDTO[] = [
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

interface Note {
    noteId: string;
    noteTitle: string;
    noteContent: string;
    createdAt: string;
    updatedAt: string;
    isCompleted: boolean;
    type: 'default' | 'confirmation';
}

type StartsWithUppercase<StringPart extends string> =
    StringPart extends Uncapitalize<StringPart> ? false : true;

type CamelToSnake<Text extends string> =
    Text extends `${infer CurrentChar}${infer RestOfString}`
        ? StartsWithUppercase<RestOfString> extends true
            ? `${Uncapitalize<CurrentChar>}_${CamelToSnake<RestOfString>}`
            : `${Uncapitalize<CurrentChar>}${CamelToSnake<RestOfString>}`
        : Text;

type MapToSnakeCaseDTO<T> = {
    [K in keyof T as CamelToSnake<K & string>]: T[K];
};

type SnakeToCamel<T extends string> =
    T extends `${infer First}_${infer Rest}`
    ? `${First}${Capitalize<SnakeToCamel<Rest>>}`
    : T; // Fix it

type MapToCamelCaseDomain<T> = {
    [K in keyof T as SnakeToCamel<K & string>]: T[K]; // Fix it
};

type NoteServerDTO = MapToSnakeCaseDTO<Note>;
type ReconstructedNote = MapToCamelCaseDomain<NoteServerDTO>;

function mapToDTO(data: ReconstructedNote): NoteServerDTO {
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

function mapFromDTO(data: NoteServerDTO): ReconstructedNote {
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

enum NoteStatusEnum {
    ACTIVE = 'active',
    COMPLETED = 'completed',
}

enum SortByEnum {
    STATUS = 'status',
    CREATED_AT = 'createdAt',
}

interface CreateNotePayload {
    noteTitle: string;
    noteContent: string;
    type?: 'default' | 'confirmation';
}

interface EditNotePayload {
    noteTitle?: string;
    noteContent?: string;
}

interface NoteStats {
    total: number;
    uncompleted: number;
}

interface NoteInfo {
    noteId: string;
    noteTitle: string;
    noteContent: string;
    createdAt: string;
    updatedAt: string;
    isCompleted: boolean;
    status: NoteStatusEnum;
    type: 'default' | 'confirmation';
}

function sanitizePayload<T extends CreateNotePayload | EditNotePayload>(
    payload: T,
): T {
    const nextPayload = { ...payload };

    if ('noteTitle' in nextPayload && typeof nextPayload.noteTitle === 'string') {
        nextPayload.noteTitle = nextPayload.noteTitle.trim();
    }

    if (
        'noteContent' in nextPayload &&
        typeof nextPayload.noteContent === 'string'
    ) {
        nextPayload.noteContent = nextPayload.noteContent.trim();
    }

    return nextPayload;
}

function validatePayload(payload: CreateNotePayload | EditNotePayload): void {
    if (
        'noteTitle' in payload &&
        payload.noteTitle !== undefined &&
        !payload.noteTitle.trim()
    ) {
        throw new Error('Title cannot be empty');
    }

    if (
        'noteContent' in payload &&
        payload.noteContent !== undefined &&
        !payload.noteContent.trim()
    ) {
        throw new Error('Content cannot be empty');
    }
}

function SanitizeInput(
    _target: object,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
): void {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
        const [firstArg, ...restArgs] = args;

        if (typeof firstArg === 'object' && firstArg !== null) {
            const sanitizedArg = sanitizePayload(
                firstArg as CreateNotePayload | EditNotePayload,
            );

            return originalMethod.apply(this, [sanitizedArg, ...restArgs]);
        }

        return originalMethod.apply(this, args);
    };
}

function ValidateNotEmpty(
    _target: object,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
): void {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
        const [firstArg] = args;

        if (typeof firstArg === 'object' && firstArg !== null) {
            validatePayload(firstArg as CreateNotePayload | EditNotePayload);
        }

        return originalMethod.apply(this, args);
    };
}

function AutoUpdateTimestamp(
    _target: object,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
): void {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
        const result = originalMethod.apply(this, args);

        if (this && typeof this === 'object' && 'updatedAt' in this) {
            (this as { updatedAt: string }).updatedAt = new Date().toISOString();
        }

        return result;
    };
}

abstract class BaseNoteEntity {
    public readonly noteId: string;
    public noteTitle: string;
    public noteContent: string;
    public readonly createdAt: string;
    public updatedAt: string;
    public isCompleted: boolean;
    public readonly type: 'default' | 'confirmation';

    protected constructor(data: ReconstructedNote) {
        this.noteId = data.noteId;
        this.noteTitle = data.noteTitle;
        this.noteContent = data.noteContent;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.isCompleted = data.isCompleted;
        this.type = data.type;
    }

    public markAsCompleted(): void {
        this.isCompleted = true;
        this.updatedAt = new Date().toISOString();
    }

    public getStatus(): NoteStatusEnum {
        return this.isCompleted ? NoteStatusEnum.COMPLETED : NoteStatusEnum.ACTIVE;
    }

    public getInfo(): NoteInfo {
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

    public abstract edit(payload: EditNotePayload): void;
    public abstract canDelete(): boolean;
}

class DefaultNoteEntity extends BaseNoteEntity {
    constructor(data: ReconstructedNote) {
        super(data);
    }

    @ValidateNotEmpty
    @SanitizeInput
    @AutoUpdateTimestamp
    public edit(payload: EditNotePayload): void {
        if (payload.noteTitle !== undefined) {
            this.noteTitle = payload.noteTitle;
        }

        if (payload.noteContent !== undefined) {
            this.noteContent = payload.noteContent;
        }
    }

    public canDelete(): boolean {
        return true;
    }
}

class ConfirmationNoteEntity extends BaseNoteEntity {
    constructor(data: ReconstructedNote) {
        super(data);
    }

    private confirmAction(_actionName: 'edit' | 'delete'): boolean {
        return true;
    }

    @ValidateNotEmpty
    @SanitizeInput
    @AutoUpdateTimestamp
    public edit(payload: EditNotePayload): void {
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

    public canDelete(): boolean {
        return this.confirmAction('delete');
    }
}

type NoteEntity = DefaultNoteEntity | ConfirmationNoteEntity;

class NotesList {
    private notes: NoteEntity[] = [];

    constructor(serverData: NoteServerDTO[] = []) {
        this.notes = serverData.map((item) =>
            this.createNoteEntity(mapFromDTO(item)),
        );
    }

    private createNoteEntity(data: ReconstructedNote): NoteEntity {
        if (data.type === 'confirmation') {
            return new ConfirmationNoteEntity(data);
        }

        return new DefaultNoteEntity(data);
    }

    private generateId(): string {
        const maxId = this.notes.reduce((max, note) => {
            const currentId = Number(note.noteId);
            return Number.isNaN(currentId) ? max : Math.max(max, currentId);
        }, 0);

        return String(maxId + 1);
    }

    private findNoteOrThrow(noteId: string): NoteEntity {
        const note = this.notes.find((item) => item.noteId === noteId);

        if (!note) {
            throw new Error(`Note with id ${noteId} not found`);
        }

        return note;
    }

    @ValidateNotEmpty
    @SanitizeInput
    public addNote(payload: CreateNotePayload): NoteInfo {
        const now = new Date().toISOString();

        const noteData: ReconstructedNote = {
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

    public removeNote(noteId: string): void {
        const note = this.findNoteOrThrow(noteId);

        if (!note.canDelete()) {
            throw new Error('Delete action was not confirmed');
        }

        this.notes = this.notes.filter((item) => item.noteId !== noteId);
    }

    public editNote(noteId: string, payload: EditNotePayload): NoteInfo {
        const note = this.findNoteOrThrow(noteId);
        note.edit(payload);

        return note.getInfo();
    }

    public getNoteById(noteId: string): NoteInfo {
        return this.findNoteOrThrow(noteId).getInfo();
    }

    public getAllNotes(): NoteInfo[] {
        return this.notes.map((note) => note.getInfo());
    }

    public markAsCompleted(noteId: string): NoteInfo {
        const note = this.findNoteOrThrow(noteId);
        note.markAsCompleted();

        return note.getInfo();
    }

    public getStats(): NoteStats {
        return {
            total: this.notes.length,
            uncompleted: this.notes.filter((note) => !note.isCompleted).length,
        };
    }

    public search(searchValue: string): NoteInfo[] {
        const normalizedValue = searchValue.trim().toLowerCase();

        return this.notes
            .filter((note) => {
                return (
                    note.noteTitle.toLowerCase().includes(normalizedValue) ||
                    note.noteContent.toLowerCase().includes(normalizedValue)
                );
            })
            .map((note) => note.getInfo());
    }

    public sort(by: SortByEnum): NoteInfo[] {
        const cloned = [...this.notes];

        if (by === SortByEnum.STATUS) {
            cloned.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
        }

        if (by === SortByEnum.CREATED_AT) {
            cloned.sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            );
        }

        return cloned.map((note) => note.getInfo());
    }

    public exportToDTO(): NoteServerDTO[] {
        return this.notes.map((note) =>
            mapToDTO({
                noteId: note.noteId,
                noteTitle: note.noteTitle,
                noteContent: note.noteContent,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
                isCompleted: note.isCompleted,
                type: note.type,
            }),
        );
    }
}

const notesList = new NotesList(mockServerResponse);

console.log('ALL NOTES');
console.log(notesList.getAllNotes());

console.log('NOTE BY ID = 1');
console.log(notesList.getNoteById('1'));

console.log('ADD NOTE');
console.log(
    notesList.addNote({
        noteTitle: '   Нова нотатка   ',
        noteContent: '   Новий текст   ',
        type: 'default',
    }),
);

console.log('EDIT NOTE');
console.log(
    notesList.editNote('1', {
        noteTitle: '   Оновлена назва   ',
        noteContent: '   Оновлений текст   ',
    }),
);

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