abstract class Shape {
    public readonly name: string;
    public readonly color: string;

    protected constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
    }

    abstract calculateArea(): number;
}

// Circle
class Circle extends Shape {
    private readonly radius: number;

    constructor(color: string, radius: number) {
        super('Circle', color);
        this.radius = radius;
    }

    calculateArea(): number {
        return Math.PI * this.radius ** 2;
    }
}

// Rectangle
class Rectangle extends Shape {
    protected readonly width: number;
    protected readonly height: number;

    constructor(color: string, width: number, height: number) {
        super('Rectangle', color);
        this.width = width;
        this.height = height;
    }

    calculateArea(): number {
        return this.width * this.height;
    }

    print(): void {
        console.log(`Rectangle area formula: width × height = ${this.width} × ${this.height}`);
    }
}

// Square
class Square extends Shape {
    private readonly side: number;

    constructor(color: string, side: number) {
        super('Square', color);
        this.side = side;
    }

    calculateArea(): number {
        return this.side ** 2;
    }

    print(): void {
        console.log(`Square area formula: side^2: ${this.side}^2`)
    }
}

// Triangle
class Triangle extends Shape {
    protected readonly base: number;
    private readonly height: number;

    constructor(color: string, base: number, height: number) {
        super('Triangle', color);
        this.base = height;
        this.height = height;
    }

    calculateArea(): number {
        return (this.base * this.height) / 2;
    }
}