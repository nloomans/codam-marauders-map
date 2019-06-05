import { makeGetRefreshingAccessToken, IGetAccessToken }  from './pull';

describe('getRefreshingAccessToken', () => {
    const access_token = 'test_access_token';
    const makeMockGetAccessToken = (expired: boolean) =>
        jest.fn(
            (() => Promise.resolve({
                token: {
                    access_token,
                },
                expired: () => expired,
            })) as unknown as IGetAccessToken
        );

    test('reuse access token on second call', async () => {
        const getAccessToken = makeMockGetAccessToken(false);

        const getRefreshingAccessToken =
            makeGetRefreshingAccessToken(getAccessToken);

        expect(await getRefreshingAccessToken()).toEqual(access_token);
        expect(await getRefreshingAccessToken()).toEqual(access_token);
        expect(getAccessToken).toBeCalledTimes(1);
    });

    test('refresh access token when expired', async () => {
        const getAccessToken = makeMockGetAccessToken(true);

        const getRefreshingAccessToken =
            makeGetRefreshingAccessToken(getAccessToken);

        expect(await getRefreshingAccessToken()).toEqual(access_token);
        expect(await getRefreshingAccessToken()).toEqual(access_token);
        expect(getAccessToken).toBeCalledTimes(2);
    });
});
