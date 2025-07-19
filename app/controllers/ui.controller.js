
// HP
export async function hpView(req, res) {
  // res.json({ message: 'Welcome to the tradingradar XP project...' })
  res.render('home', {
    id: 'hp',
    className: 'home',
    title: 'Scopri ora i segnali di borsa delle tue azioni!',
    description: 'Ottieni, in tempo reale, segnali di trading secondo le principali testate del settore e trova le azioni più interessanti di Borsa Italiana!',
    url: req.url
  })
}
