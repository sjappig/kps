const address = '0xf65ec3A78Bc782ce4B0bc2B32bc4375FF41c6b8D';

const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "selectionHash",
				"type": "bytes32"
			}
		],
		"name": "startGame",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "nonce",
				"type": "uint256"
			},
			{
				"name": "addr",
				"type": "address"
			},
			{
				"name": "selection",
				"type": "uint8"
			}
		],
		"name": "calculateSelectionHash",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "gameIdentifier",
				"type": "uint256"
			}
		],
		"name": "collectAfterTimeout",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "gameIdentifier",
				"type": "uint256"
			},
			{
				"name": "nonce",
				"type": "uint256"
			},
			{
				"name": "selection",
				"type": "uint8"
			}
		],
		"name": "reveal",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "addr",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "gameIdentifier",
				"type": "uint256"
			}
		],
		"name": "GameStarted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "gameIdentifier",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "addr",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "selection",
				"type": "uint8"
			}
		],
		"name": "Revealed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "gameIdentifier",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "opponentResult",
				"type": "uint8"
			}
		],
		"name": "GameEnded",
		"type": "event"
	}
];

export { address, abi };
