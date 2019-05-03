# Codam Marauder's Map

A very reasonable (and early alpha) map for the codam clusters

# Setup

1. Install [Node.js] and [Redis]

   If you are on a Codam iMac you can install them using homebrew:
   1. Install [42 Homebrew]:
      ```
      curl -fsSL https://rawgit.com/kube/42homebrew/master/install.sh | zsh
      ```
   2. Install [Node.js] and [Redis]:
      ```
      brew install node redis
      ```
2. [Request API keys] for the intranet.
3. Store the keys in `.env`:
   ```
   UID=your_uid_here
   SECRET=your_secret_here
   ```
4. Install dependencies using `npm i`

# Running locally

1. Start redis using `redis-server`
1. Run the project using `npm run dev` in a separate terminal.
   (hint: press `⌘\` to split the terminal in vscode)
2. Visit https://localhost:3000 :tada: (if it doesn't work, ask [nloomans] or
   [nmartins])

[42 Homebrew]: https://github.com/kube/42homebrew
[Node.js]: https://nodejs.org/
[Redis]: https://redis.io/
[Request API keys]: https://profile.intra.42.fr/oauth/applications/new
[nloomans]: https://profile.intra.42.fr/users/nloomans
[nmartins]: https://profile.intra.42.fr/users/nmartins
