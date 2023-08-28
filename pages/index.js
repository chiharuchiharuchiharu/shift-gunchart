import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [shifts, setShifts] = useState({});
  const [selectDay, setSelectDay] = useState("");
  const [selectRange, setSelectRange] = useState(["", ""]);

  const omit = (str) => {
    if (str.length <= 4) return str;
    else return str.slice(0, 4) + "_";
  };

  function getDay(num) {
    const day = ["月", "火", "水", "木", "金", "土", "日"];
    return day[num];
  }
  async function fetchShifts(firstDay) {
    if (!firstDay) return;
    const url = `/api/shift/get?day=${firstDay}`;
    return await fetch(url).then((res) => res.json());
  }
  function initSelectDay() {
    const today = new Date();
    const nextMonday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + ((7 - today.getDay()) % 7) + 1
    );
    const yyyy = nextMonday.getFullYear();
    const mm = ("0" + (nextMonday.getMonth() + 1)).slice(-2);
    const dd = ("0" + nextMonday.getDate()).slice(-2);
    setSelectDay("2023-08-28");
  }
  function getSundays(day) {
    const today = new Date(day);
    const nextMonday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + ((7 - today.getDay()))
    );
    const mm = nextMonday.getMonth() + 1;
    const dd = nextMonday.getDate();
    return `${mm}/${dd}`;
  }
  function getMonday(day) {
    const today = new Date(day);
    const nextMonday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() + 1
    );
    const mm = nextMonday.getMonth() + 1;
    const dd = nextMonday.getDate();
    return `${mm}/${dd}`;
  }
  function setNextMonday() {
    const today = new Date(selectDay);
    const nextMonday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + ((7 - today.getDay()) % 7) + 1
    );
    const yyyy = nextMonday.getFullYear();
    const mm = ("0" + (nextMonday.getMonth() + 1)).slice(-2);
    const dd = ("0" + nextMonday.getDate()).slice(-2);
    setSelectDay(`${yyyy}-${mm}-${dd}`);
  }
  function setPrevMonday() {
    const today = new Date(selectDay);
    const nextMonday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() + 1 - 7
    );
    const yyyy = nextMonday.getFullYear();
    const mm = ("0" + (nextMonday.getMonth() + 1)).slice(-2);
    const dd = ("0" + nextMonday.getDate()).slice(-2);
    setSelectDay(`${yyyy}-${mm}-${dd}`);
  }
  useEffect(() => {
    initSelectDay();
  }, []);
  useEffect(() => {
    const monday = getMonday(selectDay);
    const sunday = getSundays(selectDay);
    setSelectRange([monday, sunday]);

    (async () => {
      const s = await fetchShifts(selectDay);
      console.log(s);
      if (s) setShifts(s);
    })();
  }, [selectDay]);
  return (
    <>
      <Head>
        <title>夏活参加メンバー</title>
        <meta name="description" content="夏活の参加メンバーです。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${inter.className} ${styles.main}`}>
        <header className={styles.header}>夏活参加メンバー</header>

        <div className={styles.ctrl_container}>
          <div className={styles.last_week}>
            <p onClick={setPrevMonday}>前週</p>
          </div>

          <div className={styles.range}>
            {selectRange[0]}~{selectRange[1]}
          </div>

          <div className={styles.next_week}>
            <p onClick={setNextMonday}>翌週</p>
          </div>
        </div>
        <div className={styles.gunchart_container}>
          <div className={styles.times}>
          <span>8</span>
          <span>9</span>
          <span>10</span>
          <span>11</span>
          <span>12</span>
          <span>13</span>
          <span>14</span>
          <span>15</span>
          <span>16</span>
          <span>17</span>
          <span>18</span>
          <span>19</span>
          <span>20</span>
          <span>21</span>
          </div>
          {Object.keys(shifts).map((key, i) => {
            return (
              <div className={styles.date_container} key={key}>
                <div className={styles.date}>
                  <div>
                    <div>{key}</div>
                    <div>{getDay(i)}</div>
                  </div>
                </div>
                <div className={styles.names}>
                  {shifts[key].data.map((data, i) => {
                    return (
                      <div className={styles.name} key={i}>
                        <div>{omit(data.name)}</div>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.guncharts}>
                  {shifts[key].data.map((data, i) => {
                    return (
                      <div
                        className={styles.bar}
                        style={{ "--start": data.start, "--end": data.end }}
                        key={i}
                      ></div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className={styles.times_bottom}>
          <span>8</span>
          <span>9</span>
          <span>10</span>
          <span>11</span>
          <span>12</span>
          <span>13</span>
          <span>14</span>
          <span>15</span>
          <span>16</span>
          <span>17</span>
          <span>18</span>
          <span>19</span>
          <span>20</span>
          <span>21</span>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p className={styles.copylight}>miroku © 2023 Copyright.</p>
      </footer>
    </>
  );
}
