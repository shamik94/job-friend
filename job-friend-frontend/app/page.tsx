import Header from './components/Header';
import Footer from './components/Footer';
import CoverLetterForm from './components/CoverLetterForm';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-10">
        <CoverLetterForm />
      </main>

      <Footer />
    </div>
  )
}
