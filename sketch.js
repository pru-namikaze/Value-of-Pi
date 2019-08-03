let b0, b1;

let timesteps, collision;

let playsimulationflag, simulationStartTime, simulationduration;


let white = [255, 255, 255];
let black = [0, 0, 0];
let red = [255, 0, 0];

let Window = [document.documentElement.clientWidth, document.documentElement.clientHeight];

let digit;

let blockPosition = [500, 1000];

class block {
  constructor(x, y, mass, size, velocity) {
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.size = size;
    this.velocity = velocity;
  }

  travel() {
    this.x = this.x + (this.velocity / timesteps);
  }

  render() {
    noStroke();
    fill(...red);
    square(this.x, this.y, this.size);
  }

  blockCollision(b1) {
    let b0Velocity = (((this.mass - b1.mass) / (this.mass + b1.mass)) * this.velocity) + (((2 * b1.mass) / (this.mass + b1.mass)) * b1.velocity);
    let b1Velocity = (((b1.mass - this.mass) / (this.mass + b1.mass)) * b1.velocity) + (((2 * this.mass) / (this.mass + b1.mass)) * this.velocity);
    this.velocity = b0Velocity;
    b1.velocity = b1Velocity;
    return [this, b1];
  }

  wallRebound() {
    if (this.x <= 0) {
      this.velocity = (-1) * (this.velocity);
      collision = collision + 1;
    }
  }
}

function setup() {
  createCanvas(...Window);

  textStyle(BOLD);

  digit = new URLSearchParams(window.location.search).get('digit');
  collision = 0;

  playsimulationflag = true;
  simulationStartTime = (new Date()).getTime();

  timesteps = Math.pow(10, parseInt(1 + ((digit * 7) / 9)), 10);

  b0 = new block(blockPosition[0], (Window[1] / 2) - 100, 1, 100, 0);
  b1 = new block(blockPosition[1], (Window[1] / 2) - 200, Math.pow(100, (digit - 1)), 200, -10);
}

function draw() {
  background(...black);

  stroke(...white);
  line(0, Window[1] / 2, Window[0], Window[1] / 2);
  line(0, 0, 0, Window[1] / 2);
  
  if (playsimulationflag == true) {
    simulationduration = ((new Date()).getTime()) - simulationStartTime;
    for (i = 0; i < timesteps; i = i + 1) {
      // Stopping the Simulation.
      if ((b0.velocity >= 0) && (b1.velocity >= b0.velocity) && ((b1.x - b0.x) > 1000)) {
        alert("No More Collisions. Simulation is Over");
        playsimulationflag = false;
        break;
      }

      // Moving the object as per the Timestep.
      b0.travel();
      b1.travel();

      // Check for Collision.   
      if ((b1.x - b0.x) <= b0.size) {
        collision = collision + 1;
        let collisionBodies = b0.blockCollision(b1);
        b0 = collisionBodies[0];
        b1 = collisionBodies[1];
      }
      
      // Check for Wall Rebound.
      b0.wallRebound();
      b1.wallRebound();
    }
  }
  
  // rendering the blocks.
  b0.render();
  b1.render();

  // Showing the Statistics.
  noStroke();
  textSize(45);   
  text("Value of \u03C0", (Window[0] - textWidth("Value of \u03C0")) / 2, 80);
  
  textSize(25);
  text(`Digit: ${digit}`, 50, (Window[1] / 2) + (Window[1] / 14));
  text(`Value of PI: ${Math.PI.toString()}`, 50, (Window[1] / 2) + ((Window[1] * 2) / 14));
  text(`Collisions:  ${collision}`, 50, (Window[1] / 2) + ((Window[1] * 3) / 14));
  text(`Number of Timesteps in a second: ${timesteps}`, 50, (Window[1] / 2) + ((Window[1] * 4) / 14));
  text(`Time of Simulation( hh : mm : ss ): ${parseInt((simulationduration / 1000) / 3600) % 24} : ${parseInt(((simulationduration / 1000) / 60) % 60)} : ${parseInt((simulationduration / 1000) % 60)}`, 50, (Window[1] / 2) + ((Window[1] * 5) / 14));
}
