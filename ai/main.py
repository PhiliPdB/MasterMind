from random import choice, shuffle
from itertools import product
from copy import deepcopy
from variables import dict, scores
from sys import exit

# creates a list with all the possibilities
def generate_s(length):
    s = []

    for first, second, third, fourth in product(range(length), repeat=4):
        option = [first, second, third, fourth]

        # when all the numbers are different
        if len(set(option)) == 4:
            s.append(option)
    return s


# gives the score by looking at a given guess and the actual code only needed for automatic mode
def get_score(code, guess):
    score = ''

    for a in range(len(list(set(code).intersection(guess)))):
        score += 'w'
    for a, b in zip(code, guess):
        if a == b:
            score = 'b' + score[:len(score)-1]
    return score


# removes codes that are not possible in combination with the score
def remove_options(code, score, ls):
    for x in ls[:]:
        # Removes option if the number of colors are wrong.
        if len(list(set(x).intersection(code))) != len(score):
            ls.remove(x)
        else:
            i = 0
            for a, b in zip(code, x):
                if a == b:
                    i += 1
            if i != score.count('b'):
                ls.remove(x)
    return ls


# returns the best guess in each situation
def best_case(ls, score_process):
    # looks for first best case
    if score_process in dict.keys():
        shuffle(s)
        for a in ls:
            worst_case = 0
            for b in scores:
                case = len(remove_options(a, b, deepcopy(ls)))
                if case > worst_case:
                    worst_case = case
            if worst_case == dict.get(score_process):
                return a

    # makes a list with all the best cases and chooses one random
    else:
        worst_cases, guesses = [], []
        for a in ls:
            worst_case = 0
            for b in scores:
                case = len(remove_options(a, b, deepcopy(ls)))
                if len(worst_cases) != 0 and case > min(worst_cases):
                    worst_case = case
                    break
                if case > worst_case:
                    worst_case = case
            worst_cases.append(worst_case)
        for x in range(len(worst_cases)):
            if worst_cases[x] == min(worst_cases):
                guesses.append(ls[x])
        return choice(guesses)

# The whole process
print('The numbers (0-7) stand for the eight colors. Put in the score you got, for example: bbww.')
s = generate_s(8)
the_code = choice(s)
guess = choice(s)
print(guess)
score = input('The score: ')
score_process = score
s = remove_options(guess, score, s)
if score == 'www' or score == 'ww':
    guess = best_case(s, score_process)
else:
    guess = choice(s)

while score != scores[0]:
    print(guess)
    score = input('The score: ')
    score_process = score_process + ' ' + score
    s = remove_options(guess, score, s)
    if len(s) == 0:
        print('You probably gave me a wrong score :(')
        exit()
    guess = best_case(s, score_process)
