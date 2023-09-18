require("dotenv").config();
const path = require('path');
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3001; // По умолчанию используется порт 3000, если переменная PORT не установлена

const app = express();

// теперь клиент имеет доступ только к публичным файлам
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cors());

app.post("/computeConeTriangulation", (req, res) => {
  const { height, radius, segments } = req.body;

  // Вычисление треугольников конуса
  const triangles = [];
  const H = height;
  const R = radius;
  const N = segments;

  const A = { x: 0, y: 0, z: H }; // Сохраняем точку A
  const angle = (2 * Math.PI * (0)) / N;
  let P1 = { x: R * Math.cos(angle), y: R * Math.sin(angle), z: 0 };

  for (let i = 0; i < N; i++) {
    const angle = (2 * Math.PI * (i)) / N;
    const P2 = { x: R * Math.cos(angle), y: R * Math.sin(angle) };

    console.log('i=', i);
    console.log('P1=', P1.x, P1.y, P1.z);
    console.log('P2=', P2.x, P2.y, P2.z);
    console.log('A=', A.x, A.y, A.z);

    triangles.push(P2);

    P1 = P2; // Обновляем P1 для следующей итерации
  }

  res.json({height: height, points: triangles});
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
