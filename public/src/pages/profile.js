function Profile() {
  const [profile, setProfile] = React.useState();
  React.useEffect(() => {
    const jwtToken = window.localStorage.getItem('jwtToken');

    if (!jwtToken) {
      window.alert('請先登入');
      fb.loadScript()
        .then(() => fb.init())
        .then(() => fb.getLoginStatus())
        .then((response) => {
          if (response.status === 'connected') {
            return Promise.resolve(response.authResponse.accessToken);
          }
          return fb.login().then((response) => {
            if (response.status === 'connected') {
              return Promise.resolve(response.authResponse.accessToken);
            }
            return Promise.reject('登入失敗');
          });
        })
        .then((accessToken) =>
          api.signin({
            provider: 'facebook',
            access_token: accessToken,
          })
        )
        .then((json) => {
          window.localStorage.setItem('jwtToken', json.data.access_token);
          return api.getProfile(json.data.access_token);
        })
        .then((json) => setProfile(json.data))
        .catch((error) => window.alert(error));
      return;
    }
    api.getProfile(jwtToken).then((json) => setProfile(json.data));
  }, []);
  return (
    <div className="profile">
      <div className="profile__title">會員基本資訊</div>
      {profile && (
        <div className="profile__content">
          <img src={profile.picture} />
          <div>{profile.name}</div>
          <div>{profile.email}</div>
          <button
            onClick={() => {
              window.FB.logout();
              window.localStorage.removeItem('jwtToken');
            }}
          >
            登出
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  return (
    <React.Fragment>
      <Header cartItems={cart} />
      <Profile />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
