import asyncio
import aiohttp

from timer import timer

results = open('records.txt', 'r+')
results.truncate()
results.close()

URL_FAST_API = 'http://localhost:80/users'
URL_EXPRESS = 'http://localhost:8090/users'
PAYLOAD = {
    "username": "1",
    'name': "david israel",
    "family_name": "diamant",
    "category": "mentor"
}
repeat_time = 1


async def fetch(session, url, method, counter, payload={}):
    counter = counter + 1
    print(payload["username"])
    payload["username"] = str(int(payload["username"]) + counter)
    # print(payload["username"])
    async with getattr(session, method)(url=url, json=payload) as response:
        json_response = await response.json()


async def main(url, method, payload={}):
    counter = 0
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url, method,counter=counter,  payload=payload)
                 for _ in range(repeat_time)]
        await asyncio.gather(*tasks)


print('fast-api:')


@timer(1, "fast-api")
def func():
    asyncio.run(main(URL_FAST_API, 'post', PAYLOAD))


print('express:')


@timer(1, "express")
def func1():
    asyncio.run(main(URL_EXPRESS, 'post', PAYLOAD))
