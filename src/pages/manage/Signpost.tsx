import react from "react";

const Signpost = () => {

    return (
        <div className="container">

            <h1>Manage</h1>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 py-5 g-5">

                {/* Projects */}
                <div className="col align-items-start d-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor"
                         className="bi bi-file-earmark-code me-2 mt-1" viewBox="0 0 16 16">
                        <path
                            d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                        <path
                            d="M8.646 6.646a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 9 8.646 7.354a.5.5 0 0 1 0-.708zm-1.292 0a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L5.707 9l1.647-1.646a.5.5 0 0 0 0-.708z"/>
                    </svg>
                    <div>
                        <h3 className="fw-bold">Projects</h3>
                        <p>Create new super-projects and assign them to other projects</p>
                        <a href="/project" className="btn btn-primary">Manage projects</a>
                    </div>
                </div>

                {/* People */}
                <div className="col align-items-start d-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.75em" height="1.75em" fill="currentColor"
                         className="bi bi-person me-2 mt-1" viewBox="0 0 16 16">
                        <path
                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                    </svg>
                    <div>
                        <h3 className="fw-bold">People</h3>
                        <p>Merge identities to a new or existing person and rename people's name</p>
                        <a href="/person" className="btn btn-primary">People and identities</a>
                    </div>
                </div>

                {/* Enums */}
                <div className="col align-items-start d-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor"
                         className="bi bi-menu-button me-2 mt-1" viewBox="0 0 16 16">
                        <path
                            d="M0 1.5A1.5 1.5 0 0 1 1.5 0h8A1.5 1.5 0 0 1 11 1.5v2A1.5 1.5 0 0 1 9.5 5h-8A1.5 1.5 0 0 1 0 3.5v-2zM1.5 1a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-8z"/>
                        <path
                            d="m7.823 2.823-.396-.396A.25.25 0 0 1 7.604 2h.792a.25.25 0 0 1 .177.427l-.396.396a.25.25 0 0 1-.354 0zM0 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8zm1 3v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2H1zm14-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2h14zM2 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                    <div>
                        <h3 className="fw-bold">Enums</h3>
                        <p>Edit enum's mapping on their class or superclass detected by ALM applications</p>
                        <a href="/enums" className="btn btn-primary">Manage enums</a>
                    </div>
                </div>

                {/* Segments of project */}
                <div className="col align-items-start d-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor"
                         className="bi bi-segmented-nav me-2 mt-1" viewBox="0 0 16 16">
                        <path
                            d="M0 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6zm6 3h4V5H6v4zm9-1V6a1 1 0 0 0-1-1h-3v4h3a1 1 0 0 0 1-1z"/>
                    </svg>
                    <div>
                        <h3 className="fw-bold">Segments of project</h3>
                        <p>Swap iterations and phases, make category as an iteration, category or phase</p>
                        <div className="col align-items-start d-flex">
                            <a href="/categories" className="btn btn-primary">Categories</a>
                            <a href="/iterations" className="btn btn-primary ms-1">Iterations, phases</a>
                            <a href="/activities" className="btn btn-primary ms-1">Activities</a>
                        </div>
                    </div>
                </div>

                {/* Release */}
                <div className="col align-items-start d-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="currentColor"
                         className="bi bi-git me-2 mt-1" viewBox="0 0 16 16">
                        <path
                            d="M15.698 7.287 8.712.302a1.03 1.03 0 0 0-1.457 0l-1.45 1.45 1.84 1.84a1.223 1.223 0 0 1 1.55 1.56l1.773 1.774a1.224 1.224 0 0 1 1.267 2.025 1.226 1.226 0 0 1-2.002-1.334L8.58 5.963v4.353a1.226 1.226 0 1 1-1.008-.036V5.887a1.226 1.226 0 0 1-.666-1.608L5.093 2.465l-4.79 4.79a1.03 1.03 0 0 0 0 1.457l6.986 6.986a1.03 1.03 0 0 0 1.457 0l6.953-6.953a1.031 1.031 0 0 0 0-1.457"/>
                    </svg>
                    <div>
                        <h3 className="fw-bold">Release</h3>
                        <p>Set tag of specific configuration in database as released</p>
                        <a href="/release" className="btn btn-primary">Manage releases</a>
                    </div>
                </div>

            </div>

        </div>
    );

}

export default Signpost;
