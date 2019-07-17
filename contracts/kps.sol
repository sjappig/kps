pragma solidity ^0.5.0;

contract KPS {
    enum Selection { NONE, ROCK, PAPER, SCISSORS }
    enum Result { UNKNOWN, WINNER, LOSER, CHEATER, TIE }

    struct Player {
        address payable addr;
        uint256 bet;
        uint256 nonce;
        Selection selection;
        bytes32 selectionHash;
    }

    struct Game {
        uint256 timestamp;
        Player[2] players;
        address latestReveal;
    }

    uint256 private gameCounter;
    uint256 private pendingGame;
    
    mapping(uint256 => Game) private games;

    function startGame(bytes32 selectionHash) public payable returns (uint256 gameIdentifier) {
        require(msg.value == 1 finney, "Bet has to be exactly 1 Finney");

        bool isGamePending = pendingGame != 0;
        uint256 currentGame = isGamePending ? pendingGame : ++gameCounter;
        uint8 playerIndex = isGamePending ? 0 : 1;

        Game storage game = games[currentGame];

        game.players[playerIndex] = Player({
            addr: msg.sender,
            bet: msg.value,
            nonce: 0,
            selection: Selection.NONE,
            selectionHash: selectionHash
        });
        game.timestamp = now;

        pendingGame = isGamePending ? 0 : currentGame;

        return currentGame;
    }
    
    function reveal(uint256 gameIdentifier, uint256 nonce, Selection selection) public returns (Result) {
        Game storage game = games[gameIdentifier];

        require(game.timestamp != 0, "Game is not active");
        require(selection != Selection.NONE, "Selection can not be NONE");

        (Player storage player, Player storage opponent) = getPlayers(game);

        require(opponent.bet != 0, "Opponent has not placed a bet yet");
        require(player.selection == Selection.NONE, "Selection already revealed");

        bool lastReveal = game.latestReveal != address(0);
        player.nonce = nonce;
        game.latestReveal = msg.sender;
        game.timestamp = now;
        
        if (!isValidHash(nonce, msg.sender, selection, player.selectionHash)) {
            payBets(game, [opponent, opponent]);
            return Result.CHEATER;
        }
        
        player.selection = selection;
        Result result = Result.UNKNOWN;

        if (lastReveal) {
            result = resolveGame(player, opponent);
            if (result == Result.WINNER) {
                payBets(game, [player, player]);
            } else if (result == Result.LOSER) {
                payBets(game, [opponent, opponent]);
            } else if (result == Result.TIE) {
                payBets(game, [player, opponent]);
            }
        }
        
        return result;
    }
    
    function collectAfterTimeout(uint256 gameIdentifier) public {
        Game storage game = games[gameIdentifier];
        require(game.timestamp != 0, "Game is not active");
        require((game.timestamp + 3 minutes) < now, "Game is not yet in timeout");
        require(game.latestReveal == msg.sender, "Only latest revealer can call this");

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
    
    function isValidHash(uint256 nonce, address addr, Selection selection, bytes32 expectedHash) private pure returns (bool) {
        return keccak256(abi.encodePacked(nonce, addr, selection)) == expectedHash;
    }
    
    function payBets(Game storage game, Player[2] memory receivers) private {
        for (uint8 idx = 0; idx < 2; ++idx) {
            receivers[idx].addr.transfer(game.players[idx].bet);
            game.players[idx].bet = 0;
        }
        game.timestamp = 0;
    }
    
    function resolveGame(Player storage player, Player storage opponent) private view returns (Result) {
        if (player.selection == opponent.selection) {
            return Result.TIE;
        }
        
        if (player.selection == Selection.ROCK) {
            if (opponent.selection == Selection.SCISSORS) {
                return Result.WINNER;
            }
            if (opponent.selection == Selection.PAPER) {
                return Result.LOSER;
            }
        }
        
        if (player.selection == Selection.PAPER) {
            if (opponent.selection == Selection.ROCK) {
                return Result.WINNER;
            }
            if (opponent.selection == Selection.SCISSORS) {
                return Result.LOSER;
            }
        }
        
        if (player.selection == Selection.SCISSORS) {
            if (opponent.selection == Selection.PAPER) {
                return Result.WINNER;
            }
            if (opponent.selection == Selection.ROCK) {
                return Result.LOSER;
            }
        }
        
        return Result.UNKNOWN;
    }
}