require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3001; // По умолчанию используется порт 3000, если переменная PORT не установлена

app.use(express.json());

app.post("/computeConeTriangulation", (req, res) => {
  const { height, radius, segments } = req.body;

  // Вычисление треугольников конуса
  const triangles = [];
  const H = height;
  const R = radius;
  const N = segments;

  let P1 = { x: R, y: 0, z: 0 }; // Инициализируем P1
  const A = { x: 0, y: 0, z: H }; // Сохраняем точку A

  for (let i = 0; i < N; i++) {
    const angle = (2 * Math.PI * (i + 1)) / N;
    const P2 = { x: R * Math.cos(angle), y: R * Math.sin(angle), z: 0 };

    triangles.push([{ ...A }, { ...P1 }, { ...P2 }]);

    P1 = { ...P2 }; // Обновляем P1 для следующей итерации
  }

  res.json({ triangles });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
