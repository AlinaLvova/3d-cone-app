import PropTypes from "prop-types"; // Импортируем PropTypes
import React, { useEffect, useRef, useState } from "react";
import classes from "./index.module.scss";
import * as THREE from "three";

// Функция для создания конуса
const createConeMesh = (triangles) => {
  const h = 35;

  const data = triangles;

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
  // Создаем материал для серых граней с прозрачностью
  const greyMaterial = new THREE.MeshLambertMaterial({
    color: new THREE.Color(42 / 255, 42 / 255, 94 / 255), // Серый цвет
    opacity: 0.7, // Прозрачность
    transparent: true, // Сделаем материал прозрачным
    side: THREE.BackSide, // Изменяем направление нормалей
  });

  // Создаем материал для фиолетовой сетки граней
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(217 / 255, 56 / 255, 204 / 255), // Фиолетовый цвет в формате RGB
    wireframe: true, // Показываем только грани
  });

  return [greyMaterial, wireframeMaterial];
};

const ConeViewer = ({ triangles }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const [sceneState, setSceneState] = useState(false);
  let scene = new THREE.Scene();

  useEffect(() => {
    const scene = new THREE.Scene();

    // Получаем ссылку на контейнер и рендерер
    const container = containerRef.current;
    const renderer = rendererRef.current;
   
    // Создаем сцену, камеру и рендерер, если они еще не созданы
    if (!renderer) {
      
      // Создаем камеру с перспективной проекцией
      const camera = new THREE.PerspectiveCamera(
        75, // Угол обзора
        container.clientWidth / container.clientHeight, // Соотношение сторон
        0.1, // Ближняя видимость
        1000 // Дальняя видимость
      );
      const newRenderer = new THREE.WebGLRenderer();
      newRenderer.setClearColor(0xffffff);
      newRenderer.setSize(container.clientWidth, container.clientHeight);

      container.appendChild(newRenderer.domElement);

      camera.position.set(0, -35, 52.5);
      camera.lookAt(0, 0, 0);

      // Создаем конус и материалы
      const geometry = createConeMesh(triangles);
      const [greyMaterial, wireframeMaterial] = createMaterials();

      // Создаем меш и добавляем его в сцену с материалами
      const cone = new THREE.Mesh(geometry, greyMaterial);
      cone.rotation.x = Math.PI / 4;
      const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
      wireframe.rotation.x = Math.PI / 4;

      scene.add(cone);
      scene.add(wireframe);

      rendererRef.current = newRenderer;

      const animate = () => {
        requestAnimationFrame(animate);
        const speed = 0.003;
        cone.rotation.x += speed;
        wireframe.rotation.x += speed;
        cone.rotation.y += speed;
        wireframe.rotation.y += speed;
        wireframe.rotation.z += speed;
        cone.rotation.z += speed;

        newRenderer.render(scene, camera);
      };

      animate();

      setSceneState(false);
    }
  }, [sceneState]);

  useEffect (() => {
    setSceneState(true);
    const [greyMaterial, wireframeMaterial] = createMaterials();

    scene.remove(greyMaterial, wireframeMaterial);
    scene.clear();
      // // Создаем конус и материалы
      // const geometry = createConeMesh(triangles);
      // // Создаем меш и добавляем его в сцену с материалами
      // const cone = new THREE.Mesh(geometry, greyMaterial);
      // cone.rotation.x = Math.PI / 4;
      // const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
      // wireframe.rotation.x = Math.PI / 4;

      // scene.add(cone);
      // scene.add(wireframe);
  }, [triangles]);

  return (
    <div
      id="cone-viewer"
      className={classes["cone-viewer"]}
      ref={containerRef}
    ></div>
  );
};

// Добавляем проверку типов для пропса triangles
ConeViewer.propTypes = {
  triangles: PropTypes.arrayOf(PropTypes.object).isRequired, // Треугольники должны быть массивом и обязательными
};

export default ConeViewer;
