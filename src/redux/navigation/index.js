const WINDOW_RESIZE = 'WINDOW_RESIZE';
const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';

const initialState = {
  resolution: {
    desktop: window.innerWidth > 1199,
    tablet: window.innerWidth < 993,
    mobile: window.innerWidth < 768,
  },
  sidebarOpen: false,
};

export default function navigationReducer(state = initialState, action = {}) {
  switch (action.type) {
    case WINDOW_RESIZE:
      return Object.assign({}, state, {
        resolution: {
          desktop: window.innerWidth > 1199,
          tablet: window.innerWidth < 993,
          mobile: window.innerWidth < 768,
        },
        sidebarOpen: state.resolution.mobile ? state.sidebarOpen : false,
      });

    case TOGGLE_SIDEBAR:
      return Object.assign({}, state, {
        sidebarOpen: action.open,
      });

    default:
      return state;
  }
}

export function windowResize() {
  return {
    type: WINDOW_RESIZE,
  };
}

export function toggleSideBar(open) {
  return {
    type: TOGGLE_SIDEBAR,
    open,
  };
}
