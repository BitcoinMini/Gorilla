#GORILLA
An ASIMOS based User Interface.

Gorilla was originally designed for use on the Bitcoin Mini and built on Node.js but should work with any Linux/Bitcoind/Nodejs setup.  However no support is implied in making this code available. It has been extensively tested on a Raspberry Pi 2+ running Arch Linux, Bitcoind, and node.js. Browser support is limited to modern browsers with javascript enabled. It uses Angular.js and the jquery/bootstrap combo. The whole packaged product is available at [BitcoinMini.com](https://bitcoinmini.com/).


##Install
`git clone https://github.com/BitcoinMini/Gorilla.git`

`cd Gorilla`

###Load the npm dependencies:
`npm install`

###Run
`node bin/asimos`


##Setup
Find the internal IP address by logging into your router and finding the device on the network. More detailed directions can easily be found on the internet.


###Security
You are responsible for understanding the ramifications of opening ports on your internet connection.


###Externally Installed Packages
These applications need to be installed on your system for use, and should be installed prior to installing Gorilla.

    bitcoind & bitcoin-cli
    Nodejs
    NPM
    PM2 (For Autostart and Load Balancing)


##The Bitcoin Mini
Gorilla is designed to run on the Bitcoin Mini. Every piece of software was chosen for it's small and powerful nature to reduce the overall footprint of the Mini while keeping it fast and effienct.

All Minis come with [Arch Linux](https://www.archlinux.org/) as it's operating system and Bitcoin Core installed with the approximately 52GB of blockchain data downloaded.


###Contributors
We have bug and development bounties available. If you find a bug, create a pull request or issue. Bounties will be UP TO 0.1 btc for now, based on how big it is, and we will increase that as we can. A list of wanted development & bounties will soon be available on our subreddit r/bitcoinmini. 

If you contribute code to this project, you are implicitly allowing your code to be distributed under the MIT license. You are also implicitly verifying that all code is your original work. `</legalese>`

We will be publishing development bounties on our subreddit r/bitcoinmini in the near future. Contact us to be added to the early offer mailing list for development bounties.

Any other questions please reach out to us here on github, or on reddit. Thank you.


##License
Gorilla is free and open-source software released under the MIT license.


##Copyright
Gorilla (c) 2016 Mini Computing, LLC
