pragma solidity ^0.5.0;

contract KPS {
    enum Selection { NONE, ROCK, PAPER, SCISSORS }

    event PlayerAdded(uint256 gameIdentifier);
    event GameStarted(uint256 indexed gameIdentifier);
    event Revealed(uint256 indexed gameIdentifier, address addr, Selection selection);

    event Winner(uint256 indexed gameIdentifier, address addr);
    event Cheater(uint256 indexed gameIdentifier, address addr);
    event Tie(uint256 indexed gameIdentifier);


    struct Player {
        address payable addr;
        uint256 bet;
        uint256 nonce;
        Selection selection;
        bytes32 selectionHash;
    }

    struct Game {
        bool active;
        uint256 timestamp;
        Player[2] players;
    }

    uint256 private gameCounter;
    uint256 private pendingGame;

    mapping(uint256 => Game) private games;

    function startGame(bytes32 selectionHash) public payable {
        require(msg.value == 1 finney, "Bet has to be exactly 1 Finney");

        bool isGamePending = pendingGame != 0;
        uint256 currentGame = isGamePending ? pendingGame : ++gameCounter;
        uint8 playerIndex = isGamePending ? 0 : 1;

        Game storage game = games[currentGame];

        game.active = true;
        game.players[playerIndex] = Player({
            addr: msg.sender,
            bet: msg.value,
            nonce: 0,
            selection: Selection.NONE,
            selectionHash: selectionHash
        });
        game.timestamp = now;

        pendingGame = isGamePending ? 0 : currentGame;

        emit PlayerAdded(currentGame);

        if (isGamePending) {
          emit GameStarted(currentGame);
        }
    }

    function reveal(uint256 gameIdentifier, uint256 nonce, Selection selection) public {
        Game storage game = games[gameIdentifier];

        require(game.active, "Game is not active");
        require(selection != Selection.NONE, "Selection can not be NONE");

        (Player storage player, Player storage opponent) = getPlayers(game);

        require(opponent.bet != 0, "Opponent has not placed a bet yet");
        require(player.selection == Selection.NONE, "Selection already revealed");

        player.nonce = nonce;
        player.selection = selection;
        game.timestamp = now;

        emit Revealed(gameIdentifier, msg.sender, selection);

        if (!isValidHash(nonce, selection, player.selectionHash)) {
            payBets(game, [opponent, opponent]);
            endGame(game);
            emit Winner(gameIdentifier, opponent.addr);
            emit Cheater(gameIdentifier, player.addr);
        } else if (opponent.selection != Selection.NONE) {
            address winner = getWinnerAddress(player, opponent);
            if (winner == player.addr) {
                payBets(game, [player, player]);
                endGame(game);
                emit Winner(gameIdentifier, player.addr);
            } else if (winner == opponent.addr) {
                payBets(game, [opponent, opponent]);
                endGame(game);
                emit Winner(gameIdentifier, opponent.addr);
            } else {
                payBets(game, [player, opponent]);
                endGame(game);
                emit Tie(gameIdentifier);
            }
        }
    }

    function collectAfterTimeout(uint256 gameIdentifier) public {
        Game storage game = games[gameIdentifier];
        require(game.active, "Game is not active");
        require((game.timestamp + 3 minutes) < now, "Game is not yet in timeout");

        (Player storage player, ) = getPlayers(game);

        payBets(game, [player, player]);
    }

    function getPlayers(Game storage game) private view returns (Player storage player, Player storage opponent) {
        Player[2] storage players = game.players;
        uint8 playerIndex = currentPlayerIndex(players);
        uint8 opponentIndex = playerIndex == 0 ? 1 : 0;

        return (players[playerIndex], players[opponentIndex]);
    }

    function currentPlayerIndex(Player[2] storage players) private view returns (uint8) {
        for (uint8 idx = 0; idx < 2; ++idx) {
            if (players[idx].addr == msg.sender) {
                return idx;
            }
        }

        revert("Sender is not a player in the referred game");
    }

    function isValidHash(uint256 nonce, Selection selection, bytes32 expectedHash) private pure returns (bool) {
        bytes32 hash = keccak256(abi.encodePacked(nonce, uint8(selection)));
        return hash == expectedHash;
    }

    function payBets(Game storage game, Player[2] memory receivers) private {
        for (uint8 idx = 0; idx < 2; ++idx) {
            receivers[idx].addr.transfer(game.players[idx].bet);
            game.players[idx].bet = 0;
        }
    }

    function endGame(Game storage game) private {
        game.active = false;
    }

    function getWinnerAddress(Player storage player, Player storage opponent) private view returns (address) {
        if (player.selection == opponent.selection) {
            return address(0);
        }

        if (player.selection == Selection.ROCK) {
            if (opponent.selection == Selection.SCISSORS) {
                return player.addr;
            }
            if (opponent.selection == Selection.PAPER) {
                return opponent.addr;
            }
        }

        if (player.selection == Selection.PAPER) {
            if (opponent.selection == Selection.ROCK) {
                return player.addr;
            }
            if (opponent.selection == Selection.SCISSORS) {
                return opponent.addr;
            }
        }

        if (player.selection == Selection.SCISSORS) {
            if (opponent.selection == Selection.PAPER) {
                return player.addr;
            }
            if (opponent.selection == Selection.ROCK) {
                return opponent.addr;
            }
        }

        revert("Unable to resolve the game");
    }
}
