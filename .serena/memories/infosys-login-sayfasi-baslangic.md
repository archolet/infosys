# InfoSYS Login Sayfası - Başlangıç

## Tarih: 2025-12-18

## Görev Tanımı
- Login sayfası oluştur
- Sayfa başladığında default login ile çalışsın
- Kullanıcı adı ve şifre girilince dashboard'a yönlensin

## Mevcut Durum
- Blazor WebUI: https://localhost:7089 çalışıyor
- WebAPI: http://localhost:5278 çalışıyor
- Fluxor state management entegre edildi
- Auth Feature (State, Actions, Reducers, Effects) hazır

## Etkilenecek Dosyalar
1. Components/Pages/Login.razor (YENİ)
2. Components/Pages/Home.razor (auth kontrolü eklenecek)
3. Store/Features/Auth/AuthState.cs (kontrol)
4. Store/Features/Auth/AuthEffects.cs (kontrol)
5. Components/Layout/MainLayout.razor (auth kontrolü)

## Mevcut Auth Yapısı
- AuthState: IsAuthenticated, CurrentUser, IsLoading, ErrorMessage
- LoginAction: Email, Password, AuthenticatorCode
- LoginSuccessAction: AccessToken, User
- AuthEffects: API çağrısı yapıyor

## Plan
1. Login.razor sayfası oluştur
2. Auth kontrolü için component'ler güncelle
3. Navigation mantığı ekle
4. Test et
