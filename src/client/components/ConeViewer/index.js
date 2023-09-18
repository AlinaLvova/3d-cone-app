import PropTypes from "prop-types"; // Импортируем PropTypes
import React, { useEffect } from "react";
import classes from "./index.module.scss";
import * as THREE from "three";

// Функция для создания конуса
// eslint-disable-next-line no-unused-vars
const createConeMesh = (height, points) => {
  const h = height;
  const data = points;

  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];

  // Создание вершин и индексов для боковой поверхности конуса
  for (let i = 0; i < data.length - 1; i++) {
    vertices.push(data[i].x, data[i].y, 0);
    vertices.push(data[i + 1].x, data[i + 1].y, 0);
    vertices.push(0, 0, h);

    const vertexIndex = i * 3;
    indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2);
  }

  // Создание вершин и индексов для соединения вершины конуса с основанием
  vertices.push(data[data.length - 1].x, data[data.length - 1].y, 0);
  vertices.push(data[0].x, data[0].y, 0);
  vertices.push(0, 0, h);

  const vertexIndex = (data.length - 1) * 3;
  indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2);

  // Создание вершин и индексов для основания конуса
  for (let i = 0; i < data.length - 1; i++) {
    vertices.push(data[i].x, data[i].y, 0);
    vertices.push(data[i + 1].x, data[i + 1].y, 0);
    vertices.push(0, 0, 0);

    const vertexIndex2 = (i + data.length) * 3;
    indices.push(vertexIndex2 + 2, vertexIndex2 + 1, vertexIndex2);
  }

  // Создание вершин и индексов для соединения вершины конуса с основанием
  vertices.push(data[data.length - 1].x, data[data.length - 1].y, 0);
  vertices.push(data[0].x, data[0].y, 0);
  vertices.push(0, 0, 0);

  const vertexIndex2 = (2 * data.length - 1) * 3;
  indices.push(vertexIndex2 + 2, vertexIndex2 + 1, vertexIndex2);

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.setIndex(indices);

  return geometry;
};

// Функция для создания материалов
const createMaterials = () => {
  // Создание материала для серых граней с прозрачностью
  const greyMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color(42 / 255, 42 / 255, 94 / 255), // Серый цвет
    opacity: 0.7, 
    transparent: true, 
    side: THREE.BackSide, // Изменяем направление нормалей
  });

  // Создание материала для фиолетовой сетки граней
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(217 / 255, 56 / 255, 204 / 255), // Фиолетовый цвет в формате RGB
    wireframe: true, // Показываем только грани
  });

  return [greyMaterial, wireframeMaterial];
};

//----------------------------------------------------------------
// Function to calculate unit surface normal
const calculateUnitNormal = (point, basePoint) => {
  const Ni = new THREE.Vector3(
    point.x - basePoint.x,
    point.y - basePoint.y,
    point.z - basePoint.z
  );

  const magnitude = Math.sqrt(
    Ni.x * Ni.x + Ni.y * Ni.y + Ni.z * Ni.z
  );

  return new THREE.Vector3(Ni.x / magnitude, Ni.y / magnitude, Ni.z / magnitude);
};

// Function to create cone geometry with smooth representation
// eslint-disable-next-line no-unused-vars
const createSmoothConeMesh = (height, points) => {
  const H = height;
  const data = points;
  const R = points[0].x;

  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];
  const normals = [];

    // Создание вершин и индексов для боковой поверхности конуса
    for (let i = 0; i < data.length - 1; i++) {
      vertices.push(data[i].x, data[i].y, 0);
      vertices.push(data[i + 1].x, data[i + 1].y, 0);
      vertices.push(0, 0, H);
  
      const vertexIndex = i * 3;
      indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2);
    }
  
    // Создание вершин и индексов для соединения вершины конуса с основанием
    vertices.push(data[data.length - 1].x, data[data.length - 1].y, 0);
    vertices.push(data[0].x, data[0].y, 0);
    vertices.push(0, 0, H);
  
    const vertexIndex = (data.length - 1) * 3;
    indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2);
  
    // Создание вершин и индексов для основания конуса
    for (let i = 0; i < data.length - 1; i++) {
      vertices.push(data[i].x, data[i].y, 0);
      vertices.push(data[i + 1].x, data[i + 1].y, 0);
      vertices.push(0, 0, 0);
  
      const vertexIndex2 = (i + data.length) * 3;
      indices.push(vertexIndex2 + 2, vertexIndex2 + 1, vertexIndex2);
    }
  
    // Создание вершин и индексов для соединения вершины конуса с основанием
    vertices.push(data[data.length - 1].x, data[data.length - 1].y, 0);
    vertices.push(data[0].x, data[0].y, 0);
    vertices.push(0, 0, 0);
  
    const vertexIndex2 = (2 * data.length - 1) * 3;
    indices.push(vertexIndex2 + 2, vertexIndex2 + 1, vertexIndex2);
  
    geometry.setIndex(indices);

  // Calculate normals for each vertex based on the smooth representation formula
  for (let i = 0; i < data.length; i++) {
    const basePoint = new THREE.Vector3(0, 0, -R * R / H);
    const point = new THREE.Vector3(data[i].x, data[i].y, 0);
    const normal = calculateUnitNormal(point, basePoint);

    normals.push(normal.x, normal.y, normal.z);
  }

  // Set attributes for vertices, indices, and normals
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));

  return geometry;
};
//----------------------------------------------------------------


const ConeViewer = ({ triangles, visible }) => {
  const height = triangles.height;
  const points = triangles.points;

  useEffect(() => {
    const canvas = document.querySelector("#cone-viewer");
    const renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 75;
    const aspect = canvas.clientWidth / canvas.clientHeight; // соотношение сторон канвы
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    if (points[0].x > height) camera.position.z = points[0].x * 2;
    else camera.position.z = height * 2; // Установка начального положение камеры

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("white");

    const group = new THREE.Group();

    function addStuffToScene() {
      // Создание конуса и добавление его в группу
      const coneGeometry = createConeMesh(height, points);
      const materials = createMaterials();
      const coneMesh = new THREE.Mesh(coneGeometry, materials[0]);
      group.add(coneMesh);

      const wireframeGeometry = createConeMesh(height, points);
      const wireframeMaterial = materials[1];
      const wireframeMesh = new THREE.Mesh(
        wireframeGeometry,
        wireframeMaterial
      );
      group.add(wireframeMesh);

      scene.add(group);
    }

    function dispose() {
      if (group instanceof THREE.Object3D) {
        if (group.parent) {
          group.parent.remove(group);
        }
      }
      if (group.dispose) {
        group.dispose();
      }

      group.clear();
    }

    function process() {
      addStuffToScene();
    }

    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      return needResize;
    }

    function render(time) {
      time *= 0.001;

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      const speed = 0.2 + 1 * 0.1;
      const rot = time * speed;
      group.rotation.x = rot;
      group.rotation.y = rot;
      group.rotation.z = rot;

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    if (!visible) {
      dispose();
    } else {
      dispose();
      process();
    }

    requestAnimationFrame(render);
  }, [triangles, visible]);

  return <canvas id="cone-viewer" className={classes["cone-viewer"]}></canvas>;
};

// Добавляем проверку типов для пропсов visible и triangles
ConeViewer.propTypes = {
  triangles: PropTypes.shape({
    height: PropTypes.number.isRequired,
    points: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
};

export default ConeViewer;
