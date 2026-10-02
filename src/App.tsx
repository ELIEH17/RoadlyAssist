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

import LocationMap, { MapProvider } from "./LocationMap";

type Service = {
  name: string;
  desc: string;
  icon: React.ReactNode;
  eta: string;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

type NearbyProvider = MapProvider & {
  distance: number;
  eta: string;
  jobs: number;
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

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const earthRadius = 6371;

  const toRadians = (value: number) =>
    (value * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

function generateProviders(
  latitude: number,
  longitude: number
): NearbyProvider[] {
  const demoProviders = [
    {
      id: 1,
      name: "Roadly Auto Rescue",
      type: "Roadside & Towing",
      latitude: latitude + 0.008,
      longitude: longitude + 0.006,
      rating: 4.9,
      jobs: 326,
    },
    {
      id: 2,
      name: "Rapid Garage",
      type: "Mechanical & Battery",
      latitude: latitude - 0.013,
      longitude: longitude + 0.009,
      rating: 4.8,
      jobs: 214,
    },
    {
      id: 3,
      name: "RoadPro Service",
      type: "Tire & Roadside",
      latitude: latitude + 0.018,
      longitude: longitude - 0.012,
      rating: 4.7,
      jobs: 189,
    },
  ];

  return demoProviders
    .map((provider) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        provider.latitude,
        provider.longitude
      );

      const estimatedMinutes = Math.max(
        5,
        Math.round(distance * 4 + 4)
      );

      return {
        ...provider,
        distance,
        eta: `${estimatedMinutes} min`,
      };
    })
    .sort((a, b) => a.distance - b.distance);
}

export default function App() {
  const [step, setStep] = useState(0);
  const [service, setService] =
    useState<Service | null>(null);

  const [location, setLocation] = useState(
    "Enter your location or use GPS"
  );

  const [coordinates, setCoordinates] =
    useState<Coordinates | null>(null);

  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] =
    useState("");

  const [accepted, setAccepted] = useState(false);
  const [menu, setMenu] = useState(false);

  const [selectedProvider, setSelectedProvider] =
    useState<NearbyProvider | null>(null);

  const nearbyProviders = useMemo(() => {
    if (!coordinates) {
      return [];
    }

    return generateProviders(
      coordinates.latitude,
      coordinates.longitude
    );
  }, [coordinates]);

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
    setSelectedProvider(null);

    setTimeout(() => {
      document
        .getElementById("request-flow")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 30);
  }

  function detectLocation() {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(
        "Geolocation is not supported by your browser."
      );

      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        setCoordinates({
          latitude,
          longitude,
        });

        setLocation(
          `GPS: ${latitude.toFixed(
            5
          )}, ${longitude.toFixed(5)}`
        );

        setLocating(false);
        setLocationError("");
      },

      (error) => {
        setLocating(false);

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          setLocationError(
            "Location permission was denied. Please allow location access in your browser."
          );
        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          setLocationError(
            "Your current location could not be detected."
          );
        } else if (
          error.code === error.TIMEOUT
        ) {
          setLocationError(
            "Location request timed out. Please try again."
          );
        } else {
          setLocationError(
            "We could not access your current location."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  function resetRequest() {
    setService(null);
    setStep(0);
    setAccepted(false);
    setSelectedProvider(null);

    setCoordinates(null);

    setLocation(
      "Enter your location or use GPS"
    );

    setLocationError("");
  }

  function selectProvider(
    provider: NearbyProvider
  ) {
    setSelectedProvider(provider);
    setAccepted(true);
    setStep(3);
  }

  return (
    <div className="app">
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
          <a href="#how">
            How it works
          </a>

          <a href="#garage">
            For garages
          </a>

          <a href="#services">
            Services
          </a>

          <button className="signin">
            <UserRound size={16} />
            Sign in
          </button>
        </div>

        <button
          className="mobileMenu"
          onClick={() =>
            setMenu(!menu)
          }
        >
          <Menu />
        </button>
      </nav>

      {menu && (
        <div className="mobileNav">
          <a href="#services">
            Services
          </a>

          <a href="#garage">
            For garages
          </a>

          <button>
            Sign in
          </button>
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

              <em>
                Help is closer than you
                think.
              </em>
            </h1>

            <p>
              Request trusted roadside
              assistance in a few taps.
              Share your location, choose
              what went wrong, and connect
              with a nearby service
              provider.
            </p>

            <div className="actions">
              <button
                className="primary"
                onClick={() =>
                  document
                    .getElementById(
                      "services"
                    )
                    ?.scrollIntoView({
                      behavior:
                        "smooth",
                    })
                }
              >
                <LocateFixed
                  size={19}
                />

                Get roadside help
              </button>

              <button
                className="secondary"
                onClick={() =>
                  document
                    .getElementById(
                      "garage"
                    )
                    ?.scrollIntoView({
                      behavior:
                        "smooth",
                    })
                }
              >
                I'm a garage

                <ChevronRight
                  size={18}
                />
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

          <div className="liveCard">
            <div className="liveHead">
              <div>
                <small>
                  LIVE SERVICE AREA
                </small>

                <h3>
                  Lebanon
                </h3>
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

                <span>
                  You
                </span>
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
                <Navigation
                  size={15}
                />

                <div>
                  <b>
                    Nearest help
                  </b>

                  <span>
                    Nearby
                  </span>
                </div>
              </div>
            </div>

            <div className="liveFoot">
              <div>
                <b>
                  12
                </b>

                <span>
                  Providers nearby
                </span>
              </div>

              <div>
                <b>
                  Fast
                </b>

                <span>
                  Response time
                </span>
              </div>

              <div>
                <b>
                  4.8 ★
                </b>

                <span>
                  Avg. rating
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}

        <section
          id="services"
          className="services"
        >
          <div className="sectionhead">
            <span>
              ROADSIDE ASSISTANCE
            </span>

            <h2>
              What do you need help
              with?
            </h2>

            <p>
              Choose a service to start
              a request. You can confirm
              the details before anything
              is sent.
            </p>
          </div>

          <div className="serviceGrid">
            {services.map((item) => (
              <button
                className={
                  "service " +
                  (service?.name ===
                  item.name
                    ? "selected"
                    : "")
                }
                key={item.name}
                onClick={() =>
                  choose(item)
                }
              >
                <div className="serviceIcon">
                  {item.icon}
                </div>

                <div>
                  <b>
                    {item.name}
                  </b>

                  <span>
                    {item.desc}
                  </span>

                  <small>
                    Typical arrival{" "}
                    {item.eta}
                  </small>
                </div>

                <ChevronRight className="arrow" />
              </button>
            ))}
          </div>
        </section>

        {/* REQUEST FLOW */}

        {service && (
          <section
            id="request-flow"
            className="flowWrap"
          >
            <div className="flowTop">
              <div>
                <span>
                  ACTIVE REQUEST
                </span>

                <h2>
                  {accepted
                    ? "Help is on the way"
                    : "Request roadside assistance"}
                </h2>
              </div>

              <button
                className="close"
                onClick={
                  resetRequest
                }
              >
                <X />
              </button>
            </div>

            <div className="progress">
              <div
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <div className="stepLabels">
              <span className="active">
                Problem
              </span>

              <span
                className={
                  step >= 1
                    ? "active"
                    : ""
                }
              >
                Location
              </span>

              <span
                className={
                  step >= 2
                    ? "active"
                    : ""
                }
              >
                Provider
              </span>

              <span
                className={
                  step >= 3
                    ? "active"
                    : ""
                }
              >
                Confirmed
              </span>
            </div>

            {/* LOCATION */}

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

                  <h3>
                    Where is your
                    vehicle?
                  </h3>

                  <p>
                    Use your current GPS
                    location or enter a
                    nearby landmark or
                    address.
                  </p>

                  <button
                    className="locationButton"
                    onClick={
                      detectLocation
                    }
                    disabled={
                      locating
                    }
                  >
                    <LocateFixed />

                    <div>
                      <b>
                        {locating
                          ? "Detecting your location..."
                          : coordinates
                          ? "Location detected"
                          : "Use my current location"}
                      </b>

                      <span>
                        {coordinates
                          ? "Your GPS position is ready"
                          : "Best option for faster assistance"}
                      </span>
                    </div>
                  </button>

                  {locationError && (
                    <p
                      style={{
                        marginTop:
                          "12px",
                        color:
                          "#dc2626",
                        fontSize:
                          "14px",
                      }}
                    >
                      {
                        locationError
                      }
                    </p>
                  )}

                  <label>
                    LOCATION OR LANDMARK
                  </label>

                  <div className="input">
                    <MapPin />

                    <input
                      value={
                        location
                      }
                      onChange={(
                        event
                      ) => {
                        setLocation(
                          event.target
                            .value
                        );

                        if (
                          coordinates
                        ) {
                          setCoordinates(
                            null
                          );
                        }
                      }}
                    />
                  </div>

                  {/* REAL MAP */}

                  {coordinates ? (
                    <div
                      style={{
                        marginTop:
                          "18px",
                        marginBottom:
                          "18px",
                      }}
                    >
                      <LocationMap
                        latitude={
                          coordinates.latitude
                        }
                        longitude={
                          coordinates.longitude
                        }
                        providers={
                          nearbyProviders
                        }
                      />
                    </div>
                  ) : (
                    <div className="mapLarge">
                      <div className="road lr1" />
                      <div className="road lr2" />

                      <div className="pulsePin">
                        <MapPin />
                      </div>

                      <span className="mapHint">
                        Use GPS to display
                        your real location
                        and nearby
                        providers
                      </span>
                    </div>
                  )}

                  {coordinates && (
                    <>
                      <div
                        style={{
                          display:
                            "flex",
                          gap: "10px",
                          alignItems:
                            "center",
                          marginBottom:
                            "10px",
                          fontSize:
                            "13px",
                        }}
                      >
                        <CheckCircle2
                          size={18}
                        />

                        <span>
                          GPS location
                          detected
                          successfully
                        </span>
                      </div>

                      <div
                        style={{
                          marginBottom:
                            "18px",
                          fontSize:
                            "13px",
                        }}
                      >
                        <b>
                          {
                            nearbyProviders.length
                          }{" "}
                          demo providers
                          found nearby
                        </b>
                      </div>
                    </>
                  )}

                  <button
                    className="primary wide"
                    onClick={() =>
                      setStep(2)
                    }
                    disabled={
                      !coordinates
                    }
                  >
                    Find nearby
                    providers

                    <Search
                      size={18}
                    />
                  </button>

                  {!coordinates && (
                    <small
                      style={{
                        display:
                          "block",
                        marginTop:
                          "10px",
                      }}
                    >
                      Use GPS first to
                      search for nearby
                      providers.
                    </small>
                  )}
                </div>

                <RequestSummary
                  service={
                    service
                  }
                  location={
                    location
                  }
                />
              </div>
            )}

            {/* PROVIDERS */}

            {step === 2 && (
              <div className="flowGrid">
                <div className="flowPanel">
                  <button
                    className="back"
                    onClick={() =>
                      setStep(1)
                    }
                  >
                    <ChevronLeft />
                    Back to location
                  </button>

                  <div className="providerTitle">
                    <div>
                      <h3>
                        {
                          nearbyProviders.length
                        }{" "}
                        providers
                        available nearby
                      </h3>

                      <p>
                        Sorted from
                        nearest to
                        farthest based on
                        your GPS
                        location.
                      </p>
                    </div>

                    <span className="online">
                      <i />
                      Live demo
                    </span>
                  </div>

                  {coordinates && (
                    <div
                      style={{
                        marginBottom:
                          "20px",
                      }}
                    >
                      <LocationMap
                        latitude={
                          coordinates.latitude
                        }
                        longitude={
                          coordinates.longitude
                        }
                        providers={
                          nearbyProviders
                        }
                      />
                    </div>
                  )}

                  <div className="providerList">
                    {nearbyProviders.map(
                      (
                        provider,
                        index
                      ) => (
                        <div
                          className={
                            "provider " +
                            (index ===
                            0
                              ? "recommended"
                              : "")
                          }
                          key={
                            provider.id
                          }
                        >
                          {index ===
                            0 && (
                            <span className="recommend">
                              NEAREST
                            </span>
                          )}

                          <div className="providerLogo">
                            <Wrench />
                          </div>

                          <div className="providerInfo">
                            <b>
                              {
                                provider.name
                              }
                            </b>

                            <span>
                              {
                                provider.type
                              }
                            </span>

                            <div>
                              <Star
                                size={
                                  14
                                }
                                fill="currentColor"
                              />

                              {
                                provider.rating
                              }

                              <i>
                                •
                              </i>

                              {
                                provider.jobs
                              }{" "}
                              jobs
                            </div>
                          </div>

                          <div className="providerMeta">
                            <b>
                              {
                                provider.eta
                              }
                            </b>

                            <span>
                              {provider.distance.toFixed(
                                1
                              )}{" "}
                              km
                            </span>

                            <button
                              onClick={() =>
                                selectProvider(
                                  provider
                                )
                              }
                            >
                              Select
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <RequestSummary
                  service={
                    service
                  }
                  location={
                    location
                  }
                />
              </div>
            )}

            {/* CONFIRMED */}

            {step === 3 &&
              selectedProvider && (
                <div className="confirmed">
                  <div className="confirmIcon">
                    <CheckCircle2 />
                  </div>

                  <span className="online">
                    <i />
                    REQUEST ACCEPTED
                  </span>

                  <h2>
                    {
                      selectedProvider.name
                    }{" "}
                    is on the way
                  </h2>

                  <p>
                    Your selected
                    provider has received
                    your vehicle location
                    and service details.
                  </p>

                  <div className="tracking">
                    <div className="trackMap">
                      {coordinates ? (
                        <LocationMap
                          latitude={
                            coordinates.latitude
                          }
                          longitude={
                            coordinates.longitude
                          }
                          providers={[
                            selectedProvider,
                          ]}
                        />
                      ) : (
                        <>
                          <div className="road tr1" />
                          <div className="road tr2" />

                          <div className="driverPin trackDriver">
                            <Car
                              size={
                                17
                              }
                            />
                          </div>

                          <div className="towPin">
                            <Truck />
                          </div>

                          <div className="route" />
                        </>
                      )}
                    </div>

                    <div className="trackInfo">
                      <div className="eta">
                        <small>
                          ESTIMATED
                          ARRIVAL
                        </small>

                        <b>
                          {
                            selectedProvider.eta
                          }
                        </b>

                        <span>
                          {selectedProvider.distance.toFixed(
                            1
                          )}{" "}
                          km away
                        </span>
                      </div>

                      <hr />

                      <div className="tech">
                        <div className="avatar">
                          RA
                        </div>

                        <div>
                          <b>
                            {
                              selectedProvider.name
                            }
                          </b>

                          <span>
                            {
                              selectedProvider.type
                            }{" "}
                            • ★{" "}
                            {
                              selectedProvider.rating
                            }
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
                        Request
                        #RA-1048 •{" "}
                        {service.name}
                      </small>
                    </div>
                  </div>

                  <button
                    className="secondary"
                    style={{
                      marginTop:
                        "20px",
                    }}
                    onClick={
                      resetRequest
                    }
                  >
                    Finish demo
                  </button>
                </div>
              )}
          </section>
        )}

        {/* HOW IT WORKS */}

        <section
          id="how"
          className="how"
        >
          <div className="sectionhead">
            <span>
              HOW IT WORKS
            </span>

            <h2>
              From breakdown to back on
              the road.
            </h2>
          </div>

          <div className="howGrid">
            <div>
              <i>
                01
              </i>

              <LocateFixed />

              <h3>
                Share your location
              </h3>

              <p>
                Use GPS to tell
                RoadlyAssist exactly
                where your vehicle
                stopped.
              </p>
            </div>

            <div>
              <i>
                02
              </i>

              <Wrench />

              <h3>
                Choose the problem
              </h3>

              <p>
                Tell us whether you need
                battery, tire, towing,
                electrical or mechanical
                assistance.
              </p>
            </div>

            <div>
              <i>
                03
              </i>

              <Navigation />

              <h3>
                Find nearby help
              </h3>

              <p>
                Compare nearby providers,
                their distance, rating
                and estimated arrival
                time.
              </p>
            </div>
          </div>
        </section>

        {/* GARAGE */}

        <section
          id="garage"
          className="garage"
        >
          <div className="garageCopy">
            <span>
              FOR GARAGES & SERVICE
              PROVIDERS
            </span>

            <h2>
              One dashboard for your
              customers, vehicles and
              roadside jobs.
            </h2>

            <p>
              RoadlyAssist gives garages
              a simple workspace to
              manage daily operations and
              receive nearby assistance
              requests.
            </p>

            <div className="featureList">
              <div>
                <CheckCircle2 />
                Customer & vehicle
                profiles
              </div>

              <div>
                <CheckCircle2 />
                Repair and maintenance
                history
              </div>

              <div>
                <CheckCircle2 />
                Roadside request dispatch
              </div>

              <div>
                <CheckCircle2 />
                Appointments and job
                tracking
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
                <small>
                  GARAGE DASHBOARD
                </small>

                <b>
                  Good afternoon
                </b>
              </div>

              <span>
                RoadlyAssist
              </span>
            </div>

            <div className="dashStats">
              <div>
                <span>
                  Today's jobs
                </span>

                <b>
                  08
                </b>

                <small>
                  +2 from yesterday
                </small>
              </div>

              <div>
                <span>
                  Roadside
                </span>

                <b>
                  03
                </b>

                <small>
                  1 incoming
                </small>
              </div>

              <div>
                <span>
                  Customers
                </span>

                <b>
                  126
                </b>

                <small>
                  +8 this month
                </small>
              </div>
            </div>

            <div className="incoming">
              <div>
                <span className="dot" />

                <div>
                  <b>
                    New roadside request
                  </b>

                  <small>
                    BMW 320i • Battery
                    issue • Nearby
                  </small>
                </div>

                <button>
                  View
                </button>
              </div>

              <div className="job">
                <div className="jobIcon">
                  <Car />
                </div>

                <div>
                  <b>
                    Mercedes C200
                  </b>

                  <small>
                    Oil & filter change
                  </small>
                </div>

                <span>
                  10:30 AM
                </span>

                <em>
                  In progress
                </em>
              </div>

              <div className="job">
                <div className="jobIcon">
                  <Car />
                </div>

                <div>
                  <b>
                    Toyota Yaris
                  </b>

                  <small>
                    Brake inspection
                  </small>
                </div>

                <span>
                  12:00 PM
                </span>

                <em className="scheduled">
                  Scheduled
                </em>
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
          Roadside assistance and garage
          management — built for a better
          driver experience.
        </p>

        <small>
          Prototype MVP • React +
          TypeScript
        </small>
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
      <span>
        REQUEST SUMMARY
      </span>

      <div className="summaryService">
        <div className="serviceIcon">
          {service.icon}
        </div>

        <div>
          <b>
            {service.name}
          </b>

          <small>
            {service.desc}
          </small>
        </div>
      </div>

      <hr />

      <label>
        VEHICLE
      </label>

      <div className="vehicle">
        <div>
          <Car />
        </div>

        <span>
          <b>
            BMW 320i
          </b>

          <small>
            2018 • Black • 95,420 km
          </small>
        </span>

        <ChevronRight />
      </div>

      <label>
        PICKUP LOCATION
      </label>

      <div className="summaryLoc">
        <MapPin />

        <span>
          {location}
        </span>
      </div>

      <div className="safe">
        <ShieldCheck />

        <span>
          <b>
            Your request is private
          </b>

          <small>
            Location is shared only with
            the selected provider.
          </small>
        </span>
      </div>
    </aside>
  );
}