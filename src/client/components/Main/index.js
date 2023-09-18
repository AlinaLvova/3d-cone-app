import React, { useEffect, useState } from "react";
import classes from "./index.module.scss";
import ConeViewer from "../ConeViewer";

const data = {
  "height": 10,
  "points": [
      {
          "x": 5,
          "y": 0
      },
      {
          "x": 4.567727288213004,
          "y": 2.0336832153790008
      },
      {
          "x": 3.345653031794291,
          "y": 3.715724127386971
      },
      {
          "x": 1.5450849718747373,
          "y": 4.755282581475767
      },
      {
          "x": -0.5226423163382666,
          "y": 4.972609476841367
      },
      {
          "x": -2.499999999999999,
          "y": 4.330127018922194
      },
      {
          "x": -4.045084971874736,
          "y": 2.9389262614623664
      },
      {
          "x": -4.8907380036690284,
          "y": 1.0395584540887965
      },
      {
          "x": -4.8907380036690284,
          "y": -1.0395584540887954
      },
      {
          "x": -4.045084971874737,
          "y": -2.938926261462365
      },
      {
          "x": -2.500000000000002,
          "y": -4.330127018922193
      },
      {
          "x": -0.5226423163382712,
          "y": -4.972609476841367
      },
      {
          "x": 1.5450849718747361,
          "y": -4.755282581475768
      },
      {
          "x": 3.345653031794292,
          "y": -3.71572412738697
      },
      {
          "x": 4.567727288213005,
          "y": -2.0336832153790008
      }
  ]
};
function Main() {
  const [triangles, setTriangles] = useState(data);
  const [isVisible, setIsVisible] = useState(true);
  const [disabledButtonState, setDisabledButtonState] = useState(false);
  const [formData, setFormData] = useState({
    radius: 5,
    segments: 15,
    height: 10,
  });
  
  useEffect(()=>{
    setDisabledButtonState(!formData.radius || !formData.segments || !formData.height);
    console.log(disabledButtonState);
  },[formData]);

  const validateInput = () => {
    const { radius, segments, height } = formData;
    return radius > 0 && segments > 2 && height > 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Проверяем, если введенное значение меньше минимального, устанавливаем минимальное значение
    const minValue = e.target.getAttribute("min");
    const newValue = parseFloat(value) < parseFloat(minValue) ? minValue : value;
    setFormData({ ...formData, [name]: newValue });
    handleGenerate(e);
  };

  const handleReset = () => {
    setFormData({
      radius: "",
      segments: "",
      height: "",
    });
    setIsVisible(false);
  };

  const handleGenerate = (e) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    const radius = parseFloat(formData.radius);
    const segments = parseInt(formData.segments);
    const height = parseFloat(formData.height);

    fetch("http://localhost:3001/computeConeTriangulation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ radius, segments, height }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setIsVisible(true);
        setTriangles(data);
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
          type="number"
          min={1}
          onChange={handleInputChange}
          value={formData.radius}
        />
        <input
          className={classes.main__input}
          placeholder="segments"
          name="segments"
          type="number"
          min={3}
          onChange={handleInputChange}
          value={formData.segments}
        />
        <input
          className={classes.main__input}
          placeholder="height"
          name="height"
          type="number"
          min={1}
          onChange={handleInputChange}
          value={formData.height}
        />
        <button
          className={classes.main__button}
          type="submit"
          onClick={handleGenerate}
          disabled={disabledButtonState}
        >
          Generate
        </button>
        <button
          className={classes.main__button}
          type="reset"
          onClick={handleReset}
        >
          Reset
        </button>
      </form>
      <div className={classes.main__viewer}>
        <ConeViewer triangles={triangles} visible={isVisible} />
      </div>
    </main>
  );
}

export default Main;