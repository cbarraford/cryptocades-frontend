export function LoadAccount() {
    client.tycoonGetAccount()
      .then((response) => {
        state.account = response.data
      })
      .catch((error) => {
        window.err = error
        if (error.response.status === 404) {
          client.tycoonCreateAccount()
            .then((response) => {
              state.account = response.data
            })
            .catch((error) => {
              window.err = error
              console.log(error.response)
            })
        } else {
          console.error(error.response)
        }
      })
}
