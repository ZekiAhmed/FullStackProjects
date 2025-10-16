import Gallery from '../../components/gallery/gallery'
import './searchPage.css'
import { useSearchParams } from 'react-router';


function SearchPage() {

    let [searchParams] = useSearchParams();
    
    const search = searchParams.get('search')
    
    return (
        <Gallery search={search}/>
    )
}

export default SearchPage