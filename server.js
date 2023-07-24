const express = require("express");
const app = express();
const cors = require("cors");
const sql = require("mssql");
let jwt = require("jsonwebtoken");

require("dotenv").config();
app.use(cors());
app.use(express.json());

const token = () => {
  let playload = { name: "hoang tien", pass: "12345" };
  let tokenid = jwt.sign(playload, "hoidanit");
  console.log(tokenid);
};

const verifyToken = (token) => {
  let data = null;
  try {
    let dataToken = jwt.verify(token, "hoidanit");
    data = dataToken;
    console.log(data);
  } catch (err) {
    console.log(err);
  }
  return data;
};

verifyToken(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiaG9hbmcgdGllbiIsInBhc3MiOiIxMjM0NSIsImlhdCI6MTY4NzY5NTMyOH0.tDXpwl9rwLSHeby64RycfBu97APidCNFXzvtDU2Fchw"
);
token();

const config = {
  server: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

sql.connect(config, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Connecting successfully`);
  }
});

app.get("/api", (req, res) => {
  let request = new sql.Request();

  request.query("select * from TB_admin", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result.recordset);
    }
  });
});
app.get("/api/:id", (req, res) => {
  let request = new sql.Request();
  let id = req.params.id;

  request.query(`select * from TB_admin where id = ${id}`, (err, result) => {
    if (err) {
      res.send("nguoi dung khong ton tai");
    } else {
      res.send(result.recordset);
      console.log(result);
    }
  });
});

// add listmusic
// app.get("/api/list/music", (req, res) => {
//   const { id, username, songs } = req.body;

//   let request = new sql.Request();

//   songs.forEach((song) => {
//     request.query(
//       `INSERT INTO Songs (SongID, UserID, TenBaiHat, CaSy) VALUES (${song.id}, ${userID}, '${song.tenbaihat}', '${song.casy}')`,
//       (err, songResult) => {
//         if (err) {
//           console.log(err);
//           res
//             .status(500)
//             .send({ error: "An error occurred while inserting song data" });
//         }
//       }
//     );
//   });

//   res.send({ userResult: userResult.rowsAffected, songCount: songs.length });
//   res.send("hello world");
// });

// end add listmusic

app.post("/api", (req, res) => {
  const { username, password } = req.body;

  let request = new sql.Request();

  request.query(
    `insert into TB_admin ( username , password) values ('${username}','${password}')`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ result: result.recordset });
      }
    }
  );
});

app.put("/api/:id", (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  let request = new sql.Request();

  request.query(
    `UPDATE TB_admin SET username = '${username}', password = '${password}' WHERE id = ${id}`,
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .send({ error: "An error occurred while updating data" });
      } else {
        res.send({ result: result.recordset });
      }
    }
  );
});

app.delete("/api/:id", (req, res) => {
  const { id } = req.params;

  let request = new sql.Request();

  request.query(`DELETE FROM TB_admin WHERE id = ${id}`, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ error: "An error occurred while deleting data" });
    } else {
      res.json("delete successfully completed");
    }
  });
});

app.listen(3000, () => {
  console.log(`listening on port 3000`);
});
