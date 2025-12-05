const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } = require('docx');
const { User, Teacher, Result, ResultType, Conference } = require('../models/Relations');

// Допоміжна функція для створення заголовків
const createHeading = (text) => {
    return new Paragraph({
        text: text,
        heading: "Heading1",
        alignment: AlignmentType.CENTER,
        spacing: { after: 200, before: 200 },
    });
};

// --- ГЕНЕРАЦІЯ ПЛАНУ РОБОТИ ---
const generatePlan = async (req, res) => {
    try {
        // Отримуємо дані з БД
        const students = await User.findAll({ where: { role: 'student' } });
        const teachers = await Teacher.findAll({});

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        text: "Харківський національний університет радіоелектроніки",
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 300 }
                    }),
                    createHeading("ПЛАН РОБОТИ СТУДЕНТСЬКОГО НАУКОВОГО ГУРТКА"),
                    createHeading("«Лабораторія розробки баз даних DBLAB»"),
                    createHeading("на 2024 / 2025 навчальний рік"),
                    
                    new Paragraph({ text: "", spacing: { after: 300 } }),
                    
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Керівники наукового гуртка:", bold: true }),
                        ]
                    }),
                    ...teachers.map(t => new Paragraph({
                        text: `${t.full_name}, ${t.position || 'Викладач'}`,
                        bullet: { level: 0 }
                    })),

                    new Paragraph({ text: "", spacing: { after: 300 } }),
                    new Paragraph({
                        text: "Члени наукового гуртка:",
                        bold: true,
                        spacing: { after: 100 }
                    }),

                    // Таблиця студентів
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph({ text: "№", bold: true })] }),
                                    new TableCell({ children: [new Paragraph({ text: "ПІБ студента", bold: true })] }),
                                    new TableCell({ children: [new Paragraph({ text: "Email", bold: true })] }),
                                ],
                            }),
                            ...students.map((s, index) => new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph((index + 1).toString())] }),
                                    // Використовуємо nickname як ім'я, або комбінуємо поля, якщо є
                                    new TableCell({ children: [new Paragraph(s.nickname || s.login)] }), 
                                    new TableCell({ children: [new Paragraph(s.email)] }),
                                ],
                            })),
                        ],
                    }),

                    new Paragraph({ text: "", spacing: { after: 300 } }),
                    new Paragraph({ text: "Мета діяльності гуртка:", bold: true }),
                    new Paragraph("Створення інтегрованого освітньо-наукового простору, що сприяє підвищенню якості підготовки здобувачів..."),
                ],
            }],
        });

        const buffer = await Packer.toBuffer(doc);
        res.setHeader('Content-Disposition', 'attachment; filename=Plan_DBLAB.docx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(buffer);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error generating plan" });
    }
};

// --- ГЕНЕРАЦІЯ ЗВІТУ ПРО РЕЗУЛЬТАТИ ---
const generateReport = async (req, res) => {
    try {
        // Отримуємо результати (публікації, виступи)
        const results = await Result.findAll({
            include: [
                { model: ResultType, attributes: ['name'] },
                { model: Conference, attributes: ['name', 'approximate_date'] }
            ]
        });

        const doc = new Document({
            sections: [{
                children: [
                    createHeading("Звіт з роботи студентського наукового гуртка"),
                    createHeading("«Лабораторія розробки баз даних DBLAB»"),
                    
                    new Paragraph({ text: "Результати діяльності гуртка", heading: "Heading2", spacing: { before: 400 } }),

                    new Paragraph({ text: "1. Наукові публікації та участь у конференціях:", bold: true, spacing: { before: 200 } }),
                    
                    ...results.map((r, index) => new Paragraph({
                        children: [
                            new TextRun({ text: `${index + 1}) ${r.full_name || r.name}`, italics: false }),
                            new TextRun({ text: ` (${r.ResultType ? r.ResultType.name : 'Результат'})`, bold: true, size: 20 })
                        ],
                        spacing: { after: 100 }
                    })),

                    new Paragraph({ text: "", spacing: { after: 400 } }),
                    new Paragraph({ text: "Виконали:", spacing: { before: 400 } }),
                    new Paragraph("____________ доц. Мазурова О.О."),
                    new Paragraph("____________ ст. викл. Широкопєтлева М.С."),
                ],
            }],
        });

        const buffer = await Packer.toBuffer(doc);
        res.setHeader('Content-Disposition', 'attachment; filename=Report_DBLAB.docx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(buffer);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error generating report" });
    }
};

module.exports = { generatePlan, generateReport };