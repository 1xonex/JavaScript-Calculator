const { useState } = React;


const btnValues = [
    ["C", "+-", "%", "/"],
    [7, 8, 9, "X"],
    [4, 5, 6, "-"],
    [1, 2, 3, "+"],
    [0, ".", "="],
  ];

const btnids = [
  "clear", "inverse", "percent", "divide",
  "seven", "eight", "nine", "multiply",
  "four", "five", "six", "subtract",
  "one", "two", "three", "add",
  "zero", "decimal", "equals",
]



const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const lastTwoSign = (sign) => sign.slice(-2)

const lastSign = (sign) => sign.slice(-1)

const scndSign = (sign) => sign[sign.length-2]

const math = (a, b, sign) =>
  sign === "+" ? a + b : sign === "-" ? a - b : sign === "X" ? a * b : a / b;

function App() {
let [calc, setCalc] = useState({
        sign: "",
        num: 0,
        res: 0,
      });

      const numClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;
    
        if (removeSpaces(calc.num).length < 16) {
          setCalc({
            ...calc,
            num:
            removeSpaces(calc.num) % 1 === 0 && !calc.num.toString().includes(".")
            ? toLocaleString(Number(removeSpaces(calc.num + value)))
            : toLocaleString(calc.num + value),
        res: !calc.sign ? 0 : calc.res,
          });
        }
      };
    
      const commaClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;
    
        setCalc({
          ...calc,
          num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
        });
      };
    
      const signClickHandler = (e) => {
          setCalc({
          ...calc,
          sign: calc.sign + e.target.innerHTML,
          res: !calc.num
            ? calc.res
            : !calc.res
            ? calc.num
            : toLocaleString(
                math(
                  Number(removeSpaces(calc.res)),
                  Number(removeSpaces(calc.num)),
                  lastSign(calc.sign)
                )
              ),
          num: 0,
        });
      };
      const equalsClickHandler = () => {
        if (calc.sign && calc.num) {
          setCalc({
            ...calc,
            res:
              calc.num === "0" && calc.sign === "/"
                ? "Can't divide with 0"
                : lastTwoSign(calc.sign) === "/-" || lastTwoSign(calc.sign) ==="X-"
                ? toLocaleString(
                  math(Number(removeSpaces(calc.res)*(-1)),
                        Number(removeSpaces(calc.num)),
                        scndSign(calc.sign))
                )
                : toLocaleString(
                    math(
                      Number(removeSpaces(calc.res)),
                      Number(removeSpaces(calc.num)),
                      lastSign(calc.sign)
                    )
                  ),
            sign: "",
            num: 0,
          });
      };}
    
      const invertClickHandler = () => {
        setCalc({
          ...calc,
          num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
          res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
          sign: calc.sign,
        });
      };
    
      const percentClickHandler = () => {
        let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
        let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;
    
        setCalc({
          ...calc,
          num: (num /= Math.pow(100, 1)),
          res: (res /= Math.pow(100, 1)),
          sign: "",
        });
      };
    
      const resetClickHandler = () => {
        setCalc({
          ...calc,
          sign: "",
          num: 0,
          res: 0,
        });
      };
      


    return (
        <div className="wrapper">
        <h2>Calculator</h2>
        <div id="calculator">
        <Screen const value = {calc.num ? calc.num : calc.res} />
            <ButtonBox>
            {
          btnValues.flat().map((btn, i) => {
            return (
              <Button
                id={btnids[i]}
                key={i}
                className={btn === "=" ? "equals" : ""}
                value={btn}
                onClick={
                  btn === "C"
                    ? resetClickHandler
                    : btn === "+-"
                    ? invertClickHandler
                    : btn === "%"
                    ? percentClickHandler
                    : btn === "="
                    ? equalsClickHandler
                    : btn === "/" || btn === "X" || btn === "+" || btn === "-"
                    ? signClickHandler
                    : btn === "."
                    ? commaClickHandler
                    : numClickHandler
                }
              />
            );
          })
        }
      </ButtonBox>

        </div>
        </div>
    )

}
const ButtonBox = ({ children }) => {
    return <div className="buttonBox">{children}</div>;
};

const Button = ({ className, value, onClick, id }) => {
    return (
      <button className={className} onClick={onClick} id={id}>
        {value}
      </button>
    );
};
const Screen = ({ value }) => {
  return (
    <div id="display" className="screen" mode="single" max={70}>
      {value}
    </div>
  );
};



const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App />)