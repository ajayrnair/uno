import Head from 'next/head'
import Image from 'next/image'
import GameStatus from './status';

export default function Layout({children}) {
    return (<div className="container">
    <Head>
      <title>Uno Multiplayer</title>
      <link rel="icon" href="/images/Uno_Logo.png" />
    </Head>

    <main>
        <h1 className="title">
        </h1>
        <div className='game-status'>
              <Image
                  src="/images/Uno_Logo.png" // Route of the image file
                  height={50} // Desired size with correct aspect ratio
                  width={50} // Desired size with correct aspect ratio
                  alt="Uno Logo"
              />
              <GameStatus/>
          </div>
        {children}
    </main>


      <footer>
        A Nair Production
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 50px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          width: 100%;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        h1 {
          color: #f5d142;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
          font-size: 20px;
          background-color: #0c2a3c;
          color: white;
        }

        button {
          background-color: #ebcc5e;
          font-size: 16px;
          color: #0c2a3c;
          border-radius: 5px;
          padding: 5px;
          border: 0;
        }

        * {
          box-sizing: border-box;
        }

        .game-status {
          position: absolute;
          width: 100%;
          top: 5px;
          left: 0;
          display: flex;
          justify-content: center;
        }

        .status-info {
          align-self: center;
          padding-left: 10px;
        }

        input[type='text'] {
          border-radius: 7px;
          font-size: 20px;
          padding: 5px;
        }

        main {
          flex: 1;
          margin-top: 100px;
        }

        .error-message {
          color: #C02F1D;
        }

        .info-message {
          color: #ebcc5e;
          font-size: 16px;
        }

        .game-player {
          margin: 0 8px;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          border: 2px #aeaeae dotted;
          border-radius: 10px;
          padding: 4px;
        }

        .game-player.current-player {
          border: 2px #EFD469 dotted;
        }

        .card {
          color: white;
          border: 1px solid white;
          width: 50px;
          padding: 10px;
          border-radius: 6px;
        }
      }

      `}</style>
      </div>);
}
