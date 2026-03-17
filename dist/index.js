"use strict";
var NoteStatus;
(function (NoteStatus) {
    NoteStatus["ACTIVE"] = "active";
    NoteStatus["COMPLETED"] = "completed";
})(NoteStatus || (NoteStatus = {}));
var NoteType;
(function (NoteType) {
    NoteType["DEFAULT"] = "default";
    NoteType["CONFIRMABLE"] = "confirmable";
})(NoteType || (NoteType = {}));
var SortField;
(function (SortField) {
    SortField["STATUS"] = "status";
    SortField["CREATED_AT"] = "createdAt";
})(SortField || (SortField = {}));
class Note {
    constructor(id, title, content, type) {
        this.validateText(title, 'Title');
        this.validateText(content, 'Content');
        this.id = id;
        this.title = title.trim();
        this.content = content.trim();
        this.type = type;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.status = NoteStatus.ACTIVE;
    }
    validateText(value, fieldName) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error(`${fieldName} cannot be empty`);
        }
    }
    applyEdit(data) {
        if (data.title !== undefined) {
            this.validateText(data.title, 'Title');
            this.title = data.title.trim();
        }
        if (data.content !== undefined) {
            this.validateText(data.content, 'Content');
            this.content = data.content.trim();
        }
        this.updatedAt = new Date();
    }
    markAsCompleted() {
        this.status = NoteStatus.COMPLETED;
        this.updatedAt = new Date();
    }
    getInfo() {
        return [
            `ID: ${this.id}`,
            `Type: ${this.type}`,
            `Title: ${this.title}`,
            `Content: ${this.content}`,
            `Created at: ${this.createdAt.toLocaleString()}`,
            `Updated at: ${this.updatedAt.toLocaleString()}`,
            `Status: ${this.status}`,
        ].join('\n');
    }
}
class DefaultNote extends Note {
    constructor(id, title, content) {
        super(id, title, content, NoteType.DEFAULT);
    }
    edit(data) {
        this.applyEdit(data);
    }
}
class ConfirmableNote extends Note {
    constructor(id, title, content) {
        super(id, title, content, NoteType.CONFIRMABLE);
    }
    confirmEdit() {
        return true;
    }
    edit(data) {
        const isConfirmed = this.confirmEdit();
        if (!isConfirmed) {
            throw new Error('Edit was not confirmed');
        }
        this.applyEdit(data);
    }
}
class TodoList {
    constructor() {
        this.notes = [];
        this.nextId = 1;
    }
    addNote(title, content, type = NoteType.DEFAULT) {
        const note = type === NoteType.CONFIRMABLE
            ? new ConfirmableNote(this.nextId, title, content)
            : new DefaultNote(this.nextId, title, content);
        this.notes.push(note);
        this.nextId += 1;
        return note;
    }
    removeNote(id) {
        const index = this.notes.findIndex((note) => note.id === id);
        if (index === -1) {
            throw new Error(`Note with id ${id} not found`);
        }
        this.notes.splice(index, 1);
    }
    editNote(id, data) {
        const note = this.getNoteById(id);
        note.edit(data);
    }
    getNoteById(id) {
        const note = this.notes.find((item) => item.id === id);
        if (!note) {
            throw new Error(`Note with id ${id} not found`);
        }
        return note;
    }
    getAllNotes() {
        return [...this.notes];
    }
    markNoteAsCompleted(id) {
        const note = this.getNoteById(id);
        note.markAsCompleted();
    }
    getStats() {
        const total = this.notes.length;
        const completed = this.notes.filter((note) => note.status === NoteStatus.COMPLETED).length;
        return {
            total,
            completed,
            uncompleted: total - completed,
        };
    }
    search(query) {
        if (typeof query !== 'string' || !query.trim()) {
            throw new Error('Search query cannot be empty');
        }
        const normalizedQuery = query.trim().toLowerCase();
        return this.notes.filter((note) => {
            return (note.title.toLowerCase().includes(normalizedQuery) ||
                note.content.toLowerCase().includes(normalizedQuery));
        });
    }
    sortBy(field) {
        const sortedNotes = [...this.notes];
        switch (field) {
            case SortField.STATUS:
                return sortedNotes.sort((a, b) => a.status.localeCompare(b.status));
            case SortField.CREATED_AT:
                return sortedNotes.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            default:
                return sortedNotes;
        }
    }
}
// Example usage
const todoList = new TodoList();
todoList.addNote('Buy milk', 'Need to buy 2 liters of milk');
todoList.addNote('Learn TypeScript', 'Read about interfaces and classes');
todoList.addNote('Important task', 'This note requires confirmation before editing', NoteType.CONFIRMABLE);
todoList.editNote(1, { content: 'Need to buy 3 liters of milk' });
todoList.markNoteAsCompleted(2);
console.log('=== ALL NOTES ===');
todoList.getAllNotes().forEach((note) => {
    console.log(note.getInfo());
    console.log('--------------------');
});
console.log('=== NOTE BY ID ===');
console.log(todoList.getNoteById(1).getInfo());
console.log('=== SEARCH ===');
console.log(todoList.search('milk'));
console.log('=== SORT BY STATUS ===');
console.log(todoList.sortBy(SortField.STATUS));
console.log('=== SORT BY CREATED_AT ===');
console.log(todoList.sortBy(SortField.CREATED_AT));
console.log('=== STATS ===');
console.log(todoList.getStats());
todoList.removeNote(1);
console.log('=== AFTER REMOVE ===');
console.log(todoList.getAllNotes());
