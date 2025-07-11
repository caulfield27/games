// import { nanoid } from "../../../node_modules/nanoid/nanoid.js";
// import { reset } from "./main.js";

// const socket = new WebSocket("ws://localhost:3000");


// export const gameSessionData = {
// //   myName: "",
// //   opponentName: "",
// //   myFiledMatrix: [],
// //   sessionId: null,
// };

// Object.defineProperties(gameSessionData,{
//     name:{
//         get: () =>{
//             return "";
//         },
//         set: (value)=>{

//         }
//     }
// })

// const activeUsers = document.getElementById("active-users");
// const play = document.getElementById("play");

// export async function startGame() {
//   const result = await Swal.fire({
//     title: "Введите ваш никнейм",
//     input: "text",
//     inputPlaceholder: "никнейм",
//     confirmButtonText: "Продолжить",
//   });

//   if (result?.value) {
//     play.classList.add("play_btn_loading");
//     play.textContent = "Подбор противника...";
//     gameSessionData.myName = result.value;
//     socket.send(
//       JSON.stringify({
//         type: "selection",
//         data: {
//           name: result.value,
//         },
//       })
//     );
//   }
// }

// play.onclick = startGame;

// socket.addEventListener("open", () => {
//   console.log("Соеденение установлено");
//   const userId = nanoid();
//   socket.clientId = userId;
//   socket.send(JSON.stringify({ type: "init", data: userId }));
// });

// socket.addEventListener("message", (ev) => {
//   const msg = JSON.parse(ev.data);
//   const { type, data } = msg;
//   switch (type) {
//     case "activeUsersCount":
//       activeUsers.textContent = data;
//       break;
//     case "gameFound":
//       const parsedData = JSON.parse(data);
//       const { name, sessionId } = parsedData;
//       Swal.fire({
//         title: "Противник найден",
//         text: name,
//         showCancelButton: true,
//         cancelButtonText: "Отменить",
//         confirmButtonText: "Начать игру",
//       }).then((res) => {
//         if (res.isConfirmed) {
//           gameSessionData.opponentName = name;
//           gameSessionData.sessionId = sessionId;
//           play.textContent = "Выйти из игры";
//           play.onclick = () => {
//             socket.send(
//               JSON.stringify({
//                 type: "closeRoom",
//                 data: sessionId,
//               })
//             );
//             reset();
//           };
//           Swal.fire({
//             position: "top-start",
//             text: "Игра началась.",
//             showConfirmButton: false,
//             timer: 1000,
//           });
//         } else {
//           socket.send(
//             JSON.stringify({
//               type: "closeRoom",
//               data: sessionId,
//             })
//           );
//         }
//       });
//       break;
//   }
// });

const obj = {
    age: 23
};

Object.defineProperties(obj, {
    name: {
        get: ()=>{
            return "Alisher";
        },
        set: (newName)=>{
            console.log(newName);
        }
    }
})


console.log(obj.age, obj.name);
obj.name = "Jony";
console.log(obj.name);
