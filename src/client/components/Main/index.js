import React, { useState } from "react";
import classes from "./index.module.scss";
import ConeViewer from "../ConeViewer";

const data =  [
  {
    x: 15,
    y: 0,
  },
  {
    x: 12.135254915624213,
    y: 8.816778784387097,
  },
  {
    x: 4.635254915624212,
    y: 14.265847744427303,
  },
  {
    x: -4.63525491562421,
    y: 14.265847744427305,
  },
  {
    x: -12.13525491562421,
    y: 8.816778784387099,
  },
  {
    x: -15,
    y: 1.83697019872103e-15,
  },
  {
    x: -12.135254915624213,
    y: -8.816778784387095,
  },
  {
    x: -4.6352549156242135,
    y: -14.265847744427303,
  },
  {
    x: 4.635254915624208,
    y: -14.265847744427305,
  },
  {
    x: 12.13525491562421,
    y: -8.8167787843871,
  },
];


function Main() {
  const [triangles, setTriangles] = useState(data);
  const [formData, setFormData] = useState({
    radius: 0,
    segments: 0,
    height: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerate = () => {
    // Отправляем POST-запрос на сервер для получения массива точек
    fetch("http://localhost:3001/computeConeTriangulation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(JSON.stringify(data));
        setTriangles(data); // Обновляем состояние массива точек
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <main className={classes.main}>
      <form className={classes.main__form}>
        <input
          className={classes.main__input}
          placeholder="radius"
          name="radius"
          onChange={handleInputChange}
        />
        <input
          className={classes.main__input}
          placeholder="segments"
          name="segments"
          onChange={handleInputChange}
        />
        <input
          className={classes.main__input}
          placeholder="height"
          name="height"
          onChange={handleInputChange}
        />
        <button
          className={classes.main__button}
          type="button"
          onClick={handleGenerate}
        >
          Generate
        </button>
      </form>
      <div className={classes.main__viewer}>
        <ConeViewer triangles={triangles} />
      </div>
    </main>
  );
}

export default Main;
