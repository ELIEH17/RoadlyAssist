import React, { useMemo, useState } from "react";
import {
  BatteryCharging,
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Gauge,
  LocateFixed,
  MapPin,
  Menu,
  Navigation,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Truck,
  UserRound,
  Wrench,
  X,
  Zap,
} from "lucide-react";

type Service = {
  name: string;
  desc: string;
  icon: React.ReactNode;
  eta: string;
};

const services: Service[] = [
  {
    name: "Battery",
    desc: "Jump-start, dead battery or replacement",
    icon: <BatteryCharging />,
    eta: "8–15 min",
  },
  {
    name: "Flat Tire",
    desc: "Tire change, puncture or spare installation",
    icon: <Gauge />,
    eta: "10–20 min",
  },
  {
    name: "Towing",
    desc: "Tow your vehicle to a garage or destination",
    icon: <Truck />,
    eta: "15–25 min",
  },
  {
    name: "Mechanical",
    desc: "Engine, overheating or mechanical issue",
    icon: <Wrench />,
    eta: "12–20 min",
  },
  {
    name: "Electrical",
    desc: "Starter, alternator or electrical problem",
    icon: <Zap />,
    eta: "12–20 min",
  },
];

const providers = [
  {
    name: "North Auto Rescue",
    kind: "Roadside & Towing",
    distance: "1.8 km",
    eta: "9 min",
    rating: "4.9",
    jobs: "326",
  },
  {
    name: "Rapid Garage",
    kind: "Mechanical & Battery",
    distance: "2.6 km",
    eta: "13 min",
    rating: "4.8",
    jobs: "214",
  },
  {
    name: "RoadPro Service",
    kind: "Tire & Roadside",
    distance: "3.1 km",
    eta: "16 min",
    rating: "4.7",
    jobs: "189",
  },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [location, setLocation] = useState(
    "Enter your location or use GPS"
  );
  const [locating, setLocating] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [menu, setMenu] = useState(false);

  const activeProvider = providers[0];

  const progress = useMemo(() => {
    if (step === 0) return 25;
    if (step === 1) return 50;
    if (step === 2) return 75;
    return 100;
  }, [step]);

  function choose(selectedService: Service) {
    setService(selectedService);
    setStep(1);
    setAccepted(false);

    setTimeout(() => {
      document
        .getElementById("request-flow")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 30);
  }

  function detectLocation() {
    setLocating(true);

    if (!navigator.geolocation) {
      setLocation("Geolocation is not supported by this browser.");
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(5);
        const longitude = position.coords.longitude.toFixed(5);

        setLocation(`GPS: ${latitude}, ${longitude}`);
        setLocating(false);
      },
      () => {
        setLocation(
          "Location permission unavailable — enter your location manually"
        );
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
      }
    );
  }

  return (
    <div className="app">
      {/* NAVIGATION */}
      <nav>
        <div className="brand">
          <span>
            <Car size={20} />
          </span>

          <div>
            Roadly<b>Assist</b>
          </div>
        </div>

        <div className="navlinks">
          <a href="#how">How it works</a>
          <a href="#garage">For garages</a>
          <a href="#services">Services</a>

          <button className="signin">
            <UserRound size={16} />
            Sign in
          </button>
        </div>

        <button
          className="mobileMenu"
          onClick={() => setMenu(!menu)}
        >
          <Menu />
        </button>
      </nav>

      {menu && (
        <div className="mobileNav">
          <a href="#services">Services</a>
          <a href="#garage">For garages</a>
          <button>Sign in</button>
        </div>
      )}

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="heroCopy">
            <div className="eyebrow">
              <span />
              Roadside help across Lebanon
            </div>

            <h1>
              Stranded on the road?
              <br />
              <em>Help is closer than you think.</em>
            </h1>

            <p>
              Request trusted roadside assistance in a few taps.
              Share your location, choose what went wrong, and
              connect with a nearby service provider.
            </p>

            <div className="actions">
              <button
                className="primary"
                onClick={() =>
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <LocateFixed size={19} />
                Get roadside help
              </button>

              <button
                className="secondary"
                onClick={() =>
                  document
                    .getElementById("garage")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                I'm a garage
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="trust">
              <span>
                <ShieldCheck />
                Verified providers
              </span>

              <span>
                <Clock3 />
                Fast response
              </span>

              <span>
                <MapPin />
                Location based
              </span>
            </div>
          </div>

          {/* MAP PREVIEW */}
          <div className="liveCard">
            <div className="liveHead">
              <div>
                <small>LIVE SERVICE AREA</small>
                <h3>Lebanon</h3>
              </div>

              <span className="online">
                <i />
                Providers online
              </span>
            </div>

            <div className="miniMap">
              <div className="road r1" />
              <div className="road r2" />
              <div className="road r3" />

              <div className="driverPin">
                <div>
                  <Car size={18} />
                </div>
                <span>You</span>
              </div>

              <div className="providerPin p1">
                <Wrench size={15} />
              </div>

              <div className="providerPin p2">
                <Truck size={15} />
              </div>

              <div className="providerPin p3">
                <Wrench size={15} />
              </div>

              <div className="mapBadge">
                <Navigation size={15} />

                <div>
                  <b>Nearest help</b>
                  <span>1.8 km away</span>
                </div>
              </div>
            </div>

            <div className="liveFoot">
              <div>
                <b>12</b>
                <span>Providers nearby</span>
              </div>

              <div>
                <b>~9 min</b>
                <span>Fastest arrival</span>
              </div>

              <div>
                <b>4.8 ★</b>
                <span>Avg. rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="services">
          <div className="sectionhead">
            <span>ROADSIDE ASSISTANCE</span>

            <h2>What do you need help with?</h2>

            <p>
              Choose a service to start a request. You can confirm
              the details before anything is sent.
            </p>
          </div>

          <div className="serviceGrid">
            {services.map((item) => (
              <button
                className={
                  "service " +
                  (service?.name === item.name ? "selected" : "")
                }
                key={item.name}
                onClick={() => choose(item)}
              >
                <div className="serviceIcon">{item.icon}</div>

                <div>
                  <b>{item.name}</b>
                  <span>{item.desc}</span>
                  <small>Typical arrival {item.eta}</small>
                </div>

                <ChevronRight className="arrow" />
              </button>
            ))}
          </div>
        </section>

        {/* REQUEST FLOW */}
        {service && (
          <section id="request-flow" className="flowWrap">
            <div className="flowTop">
              <div>
                <span>ACTIVE REQUEST</span>

                <h2>
                  {accepted
                    ? "Help is on the way"
                    : "Request roadside assistance"}
                </h2>
              </div>

              <button
                className="close"
                onClick={() => {
                  setService(null);
                  setStep(0);
                  setAccepted(false);
                }}
              >
                <X />
              </button>
            </div>

            <div className="progress">
              <div style={{ width: `${progress}%` }} />
            </div>

            <div className="stepLabels">
              <span className="active">Problem</span>

              <span className={step >= 1 ? "active" : ""}>
                Location
              </span>

              <span className={step >= 2 ? "active" : ""}>
                Provider
              </span>

              <span className={step >= 3 ? "active" : ""}>
                Confirmed
              </span>
            </div>

            {/* LOCATION STEP */}
            {step === 1 && (
              <div className="flowGrid">
                <div className="flowPanel">
                  <button
                    className="back"
                    onClick={() => {
                      setService(null);
                      setStep(0);
                    }}
                  >
                    <ChevronLeft />
                    Change service
                  </button>

                  <h3>Where is your vehicle?</h3>

                  <p>
                    Use your current GPS location or enter a nearby
                    landmark or address.
                  </p>

                  <button
                    className="locationButton"
                    onClick={detectLocation}
                  >
                    <LocateFixed />

                    <div>
                      <b>
                        {locating
                          ? "Detecting your location..."
                          : "Use my current location"}
                      </b>

                      <span>
                        Best option for faster assistance
                      </span>
                    </div>
                  </button>

                  <label>LOCATION OR LANDMARK</label>

                  <div className="input">
                    <MapPin />

                    <input
                      value={location}
                      onChange={(event) =>
                        setLocation(event.target.value)
                      }
                    />
                  </div>

                  <div className="mapLarge">
                    <div className="road lr1" />
                    <div className="road lr2" />

                    <div className="pulsePin">
                      <MapPin />
                    </div>

                    <div className="mapControls">
                      +
                      <hr />
                      −
                    </div>

                    <span className="mapHint">
                      Map preview — real map integration comes next
                    </span>
                  </div>

                  <button
                    className="primary wide"
                    onClick={() => setStep(2)}
                  >
                    Find nearby providers
                    <Search size={18} />
                  </button>
                </div>

                <RequestSummary
                  service={service}
                  location={location}
                />
              </div>
            )}

            {/* PROVIDER STEP */}
            {step === 2 && (
              <div className="flowGrid">
                <div className="flowPanel">
                  <button
                    className="back"
                    onClick={() => setStep(1)}
                  >
                    <ChevronLeft />
                    Back to location
                  </button>

                  <div className="providerTitle">
                    <div>
                      <h3>3 providers available nearby</h3>
                      <p>
                        Sorted by estimated arrival time.
                      </p>
                    </div>

                    <span className="online">
                      <i />
                      Live
                    </span>
                  </div>

                  <div className="providerList">
                    {providers.map((provider, index) => (
                      <div
                        className={
                          "provider " +
                          (index === 0 ? "recommended" : "")
                        }
                        key={provider.name}
                      >
                        {index === 0 && (
                          <span className="recommend">
                            FASTEST
                          </span>
                        )}

                        <div className="providerLogo">
                          <Wrench />
                        </div>

                        <div className="providerInfo">
                          <b>{provider.name}</b>
                          <span>{provider.kind}</span>

                          <div>
                            <Star
                              size={14}
                              fill="currentColor"
                            />
                            {provider.rating}
                            <i>•</i>
                            {provider.jobs} jobs
                          </div>
                        </div>

                        <div className="providerMeta">
                          <b>{provider.eta}</b>
                          <span>{provider.distance}</span>

                          <button
                            onClick={() => {
                              setStep(3);
                              setAccepted(true);
                            }}
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <RequestSummary
                  service={service}
                  location={location}
                />
              </div>
            )}

            {/* CONFIRMED STEP */}
            {step === 3 && (
              <div className="confirmed">
                <div className="confirmIcon">
                  <CheckCircle2 />
                </div>

                <span className="online">
                  <i />
                  REQUEST ACCEPTED
                </span>

                <h2>
                  {activeProvider.name} is on the way
                </h2>

                <p>
                  Your provider has received your vehicle location
                  and service details.
                </p>

                <div className="tracking">
                  <div className="trackMap">
                    <div className="road tr1" />
                    <div className="road tr2" />

                    <div className="driverPin trackDriver">
                      <Car size={17} />
                    </div>

                    <div className="towPin">
                      <Truck />
                    </div>

                    <div className="route" />
                  </div>

                  <div className="trackInfo">
                    <div className="eta">
                      <small>ESTIMATED ARRIVAL</small>
                      <b>{activeProvider.eta}</b>
                      <span>{activeProvider.distance} away</span>
                    </div>

                    <hr />

                    <div className="tech">
                      <div className="avatar">NA</div>

                      <div>
                        <b>{activeProvider.name}</b>
                        <span>
                          Roadside technician • ★{" "}
                          {activeProvider.rating}
                        </span>
                      </div>
                    </div>

                    <div className="contact">
                      <button>
                        <Phone />
                        Call provider
                      </button>

                      <button className="secondary">
                        <Navigation />
                        Directions
                      </button>
                    </div>

                    <small className="requestId">
                      Request #RA-1048 • {service.name}
                    </small>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* HOW IT WORKS */}
        <section id="how" className="how">
          <div className="sectionhead">
            <span>HOW IT WORKS</span>
            <h2>From breakdown to back on the road.</h2>
          </div>

          <div className="howGrid">
            <div>
              <i>01</i>
              <LocateFixed />
              <h3>Share your location</h3>
              <p>
                Use GPS or enter exactly where your vehicle
                stopped.
              </p>
            </div>

            <div>
              <i>02</i>
              <Wrench />
              <h3>Choose the problem</h3>
              <p>
                Tell us whether you need battery, tire, towing,
                electrical or mechanical assistance.
              </p>
            </div>

            <div>
              <i>03</i>
              <Navigation />
              <h3>Track your provider</h3>
              <p>
                Select nearby help and follow the request until
                assistance arrives.
              </p>
            </div>
          </div>
        </section>

        {/* GARAGE */}
        <section id="garage" className="garage">
          <div className="garageCopy">
            <span>FOR GARAGES & SERVICE PROVIDERS</span>

            <h2>
              One dashboard for your customers, vehicles and
              roadside jobs.
            </h2>

            <p>
              RoadlyAssist gives garages a simple workspace to
              manage daily operations and receive nearby
              assistance requests.
            </p>

            <div className="featureList">
              <div>
                <CheckCircle2 />
                Customer & vehicle profiles
              </div>

              <div>
                <CheckCircle2 />
                Repair and maintenance history
              </div>

              <div>
                <CheckCircle2 />
                Roadside request dispatch
              </div>

              <div>
                <CheckCircle2 />
                Appointments and job tracking
              </div>
            </div>

            <button>
              Explore garage tools
              <ChevronRight />
            </button>
          </div>

          <div className="dashboard">
            <div className="dashHead">
              <div>
                <small>GARAGE DASHBOARD</small>
                <b>Good afternoon</b>
              </div>

              <span>RoadlyAssist</span>
            </div>

            <div className="dashStats">
              <div>
                <span>Today's jobs</span>
                <b>08</b>
                <small>+2 from yesterday</small>
              </div>

              <div>
                <span>Roadside</span>
                <b>03</b>
                <small>1 incoming</small>
              </div>

              <div>
                <span>Customers</span>
                <b>126</b>
                <small>+8 this month</small>
              </div>
            </div>

            <div className="incoming">
              <div>
                <span className="dot" />

                <div>
                  <b>New roadside request</b>
                  <small>
                    BMW 320i • Battery issue • 1.8 km
                  </small>
                </div>

                <button>View</button>
              </div>

              <div className="job">
                <div className="jobIcon">
                  <Car />
                </div>

                <div>
                  <b>Mercedes C200</b>
                  <small>Oil & filter change</small>
                </div>

                <span>10:30 AM</span>
                <em>In progress</em>
              </div>

              <div className="job">
                <div className="jobIcon">
                  <Car />
                </div>

                <div>
                  <b>Toyota Yaris</b>
                  <small>Brake inspection</small>
                </div>

                <span>12:00 PM</span>
                <em className="scheduled">Scheduled</em>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand">
          <span>
            <Car size={18} />
          </span>

          <div>
            Roadly<b>Assist</b>
          </div>
        </div>

        <p>
          Roadside assistance and garage management — built for a
          better driver experience.
        </p>

        <small>Prototype MVP • React + TypeScript</small>
      </footer>
    </div>
  );
}

function RequestSummary({
  service,
  location,
}: {
  service: Service;
  location: string;
}) {
  return (
    <aside className="summary">
      <span>REQUEST SUMMARY</span>

      <div className="summaryService">
        <div className="serviceIcon">
          {service.icon}
        </div>

        <div>
          <b>{service.name}</b>
          <small>{service.desc}</small>
        </div>
      </div>

      <hr />

      <label>VEHICLE</label>

      <div className="vehicle">
        <div>
          <Car />
        </div>

        <span>
          <b>BMW 320i</b>
          <small>2018 • Black • 95,420 km</small>
        </span>

        <ChevronRight />
      </div>

      <label>PICKUP LOCATION</label>

      <div className="summaryLoc">
        <MapPin />
        <span>{location}</span>
      </div>

      <div className="safe">
        <ShieldCheck />

        <span>
          <b>Your request is private</b>
          <small>
            Location is shared only with the selected provider.
          </small>
        </span>
      </div>
    </aside>
  );
}