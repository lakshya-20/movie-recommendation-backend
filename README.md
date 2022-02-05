<br />
<p align="center">  

  <h3 align="center">Flick Movie Recommendation System</h3>

  <p align="center">
    This is the backend repository for Flick Movie Recommendation which is a content based recommendation system that provides users with movie recommendations based on their past interaction with the system.
    <br />
    <br />
    <a href = "https://documenter.getpostman.com/view/7376254/UVeGr6Kt"> API Documentation</a>
    .
    <a href="https://flick--backend.herokuapp.com/">View Live</a>
    ·
    <a href="https://github.com/lakshya-20/flick-backend/issues">Report Bug</a>
    ·
    <a href="https://github.com/lakshya-20/flick-backend/issues">Request Feature</a>
    .
    <a href="https://github.com/lakshya-20/flick-frontend">Frontend Repository</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

The aim of this project is to build a web based application that will recommend movies to users that they might want to watch.
<br>
For this a content-boosted recommendation system is implemented that make use of ratings as well as comments to weight the recommendations. 

Here's why:
* The application only needs a web browser to work and can work on low-end devices.
* The application does not violet any legal requirement the user’s data is kept safe within the system as well as it does not violet any content laws.
* The application is working with an average latency of less than 100ms.


### Built With

* [Node.js](https://nodejs.org/en/).
* [Express.js](https://expressjs.com/)
* [Mongoose](https://mongoosejs.com/)
* [Winston](https://www.npmjs.com/package/winston)
* [Pasport.js](http://www.passportjs.org/)
* [Python](https://www.python.org/)
* [Flask](https://flask.palletsprojects.com/en/2.0.x/)
* [Pandas](https://pandas.pydata.org/)




<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* [Docker](https://www.docker.com/)
* [Docker-compose](https://docs.docker.com/compose/)
* ~4 GB Free Main Memory

### Installation

1. Clone the repo
  ```sh
    git clone https://github.com/lakshya_20/flick-backend.git
  ```
2. Create `.env` file with following entries
  ```
    MONGOURL=mongodb://admin:password@mongodb:27017
    JWT_SECRET=JWT_SECRET,
    FRONTEND_URL=http://localhost:3000/
    PORT=5000
    REDIS_URL=redis://@redis:6379
    GOOGLECALLBACKURL=<value>
    GOOGLECLIENTID=<value>
    GOOGLECLIENTSEARCH=<value>
  ```
3. Build the docker image
  ```sh
    docker-compose build
  ```
4. Run the application
  ```sh
    docker-compose up
  ```
  - Nodejs server will run at [http://localhost:5000](http://localhost:5000)
  - Flask (recommendation_service) will run at [http://localhost:5001](http://localhost:5001)


5. Open [http://localhost:5000](http://localhost:5000) to view the nodejs server documentation.

> [Live Demo](https://flick--backend.herokuapp.com/)

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/lakshya-20/flick-backend/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing
Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b some-new-feature`)
3. Commit your Changes (`git commit -m 'Add some feature'`)
4. In case of multiple commits squash them. [Refer documentation](https://www.internalpointers.com/post/squash-commits-into-one-git)
5. Push to the Branch (`git push origin some-new-feature`)
6. Open a Pull Request 



<!-- LICENSE -->
## License

Distributed under the GNU General Public License v3.0. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Lakshya Bansal - [lakshyabansal](https://www.linkedin.com/in/lakshyabansal/)

Project Link: [https://github.com/lakshya-20/flick-backend](https://github.com/lakshya-20/flick-backend)

